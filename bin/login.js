#!/usr/bin/env node

const { Command } = require('commander')
const { login } = require('./lib')
const { format } = require('util')

const program = new Command()
program
    .name('n-login')
    .argument('<host>', 'Host info in format user@host:port')
    .option('-p, --password <password>', 'Password')

async function execute(ctx, command, progressFn) {
    const argv = command.split(' ').filter(it => it)
    let stripAnsi = await import('strip-ansi')
    program.parse(['node', ...argv])
    const [host] = program.processedArgs
    const options = program.opts()
    const match = host.match(/^(\w+)@([\w.]+):(\d+)$/)
    if (match) {
        const [_, username, host, port] = match
        const ssh = await login.call(ctx, {
            username,
            host,
            port,
            password: options.password
        })
        const shell = await ssh.shell()
        const queue = []
        let buffer = ''
        let marker = '__END__'
        shell.on('data', async data => {
            buffer += data.toString()
            let index = buffer.indexOf(marker)
            while (index !== -1 && queue.length > 0) {
                let prefix = buffer.substring(0, index)
                buffer = buffer.substring(index + marker.length)
                if (prefix.endsWith('echo ')) {
                    index = buffer.indexOf(marker)
                    continue
                }
                const { resolve, reject } = queue.shift()
                let message = stripAnsi.default(prefix).trim()
                const isSuccess = message.endsWith('__0__')
                message = message.replace(/__[0,9]+__/g, '')
                if (isSuccess) {
                    resolve(message)
                } else {
                    reject(new Error(message))
                }
            }
        })
        ctx.exec = async command => {
            return new Promise((resolve, reject) => {
                queue.push({
                    resolve,
                    reject
                })
                const text = format('%s;echo __$?__;echo %s\r', command, marker)
                shell.write(text)
            })
        }
        ctx.disposables.push(() => {
            shell.close()
            ssh.close()
        })
        return '已连接到' + host
    }
}

module.exports = execute
