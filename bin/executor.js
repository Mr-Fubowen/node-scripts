const cp = require('child_process')
const { dirname, basename } = require('path')
const fs = require('fs-extra')
const ask = require('../utils/ask')
const log = require('../utils/log')
const time = require('../utils/time')

const zip = require('./zip')
const unzip = require('./unzip')
const login = require('./login')
const upload = require('./upload')
const text = require('./text')
const backup = require('./backup')

const handlers = new Map()

handlers.set('n-zip', zip)
handlers.set('n-unzip', unzip)
handlers.set('n-login', login)
handlers.set('n-upload', upload)
handlers.set('n-text', text)
handlers.set('n-backup', backup)

function parseArgs(text) {
    const regex = /\{\{(\w+)(?::([^}]+))?\}\}/g
    const params = new Map()
    let match
    while ((match = regex.exec(text)) !== null) {
        const name = match[1]
        const defaultValue = match[2]
        const value = params.get(name)
        value || params.set(name, defaultValue)
    }
    return params
}
function patchArgs(args, data) {
    for (const key in data) {
        const value = data[key]
        setPart(args, key, value)
    }
    args.set('TIMESTAMP', time.now('yyyy-MM-dd-HH-mm-ss'))
    return args
}
function setPart(args, key, value) {
    args.set(key, value)
    switch (key) {
        case 'PATH':
            if (value) {
                args.set('PARENT_PATH', dirname(value))
                args.set('NAME', basename(value))
            }
            break
    }
}
async function promptMissingArgs(args) {
    for (const [key, value] of args) {
        if (!value) {
            const userValue = await ask.input(key, '请输入脚本变量 ' + key + ':')
            setPart(args, key, userValue)
        }
    }
    return args
}
function replace(script, args) {
    return script.replace(
        /\{\{(\w+)(?::([^}]+))?\}\}/g,
        (match, name, defaultValue) => args[name] || defaultValue || match
    )
}
function parseEnvironment(value) {
    const environment = {}
    if (value) {
        const items = value.split(',')
        items.forEach(item => {
            const [key, value] = item.split('=')
            if (key == 'PF') {
                const password = fs.readFileSync(value, 'utf-8')
                environment['PASSWORD'] = password
            } else {
                environment[key] = value
            }
        })
    }
    return environment
}
function onLog(type, data) {
    switch (type) {
        case 'STD_IN':
            log.info(data)
            break
        case 'STD_OUT':
            log.info(data)
            break
        case 'STD_ERR':
            log.error(data)
            break
    }
}
async function executeInContext(script, progressFn, context) {
    const commands = script.split(/\r?\n/)
    for (let item of commands) {
        item = item.trim()
        if (item == '') {
            continue
        }
        const command = replace(item, context.env)
        const match = command.match(/^\s*(\S+)/)
        if (match) {
            const fn = handlers.get(match[1])
            const message = {}
            progressFn('STD_IN', command)
            try {
                message.type = 'STD_OUT'
                if (fn) {
                    message.data = await fn(context, command)
                } else {
                    message.data = await context.exec(command)
                }
            } catch (error) {
                message.type = 'STD_ERR'
                message.data = error.message
                progressFn(message.type, message.data)
                break
            }
        }
    }
    context.disposables.forEach(fn => fn())
}
async function execute(script, progressFn, env) {
    let args = parseArgs(script)
    args = patchArgs(args, env)
    await promptMissingArgs(args)
    log.mapLog(args, '脚本变量: ')
    env = Object.fromEntries(args)
    const ctx = {
        env: env,
        exec: command => {
            return new Promise((resolve, reject) => {
                cp.exec(command, (error, stdout, stderr) => {
                    if (error) {
                        return reject(stderr)
                    }
                    resolve(stdout)
                })
            })
        },
        disposables: []
    }
    return await executeInContext(script, progressFn, ctx)
}
async function executeScript(path, options) {
    const text = fs.readFileSync(path, 'utf-8')
    if (options.view) {
        log.text(text, '脚本内容')
    } else {
        const environment = parseEnvironment(options.environment)
        await execute(text, onLog, environment)
    }
}

module.exports = {
    execute,
    executeScript
}
