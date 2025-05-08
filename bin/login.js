#!/usr/bin/env node

const { Command } = require('commander')
const { login } = require('./lib')

const program = new Command()
program
    .name('n-login')
    .argument('<host>', 'Host info in format user@host:port')
    .option('-p, --password <password>', 'Password')

async function execute(ctx, command) {
    const argv = command.split(' ').filter(it => it)
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
        ctx.exec = async command => {
            return await ssh.execute(command)
        }
        ctx.disposables.push(() => ssh.close())
        return '已连接到' + host
    }
}

module.exports = execute

////121.36.96.142
