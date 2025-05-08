#!/usr/bin/env node

const { Command } = require('commander')
const { upload } = require('./lib')

function parseTarget(target) {
    const match = target.match(/^([^@]+)@([^:]+):(\d+)(\/.+)$/)
    if (!match) {
        throw new Error('格式不正确')
    }
    const [, username, host, port, path] = match
    return {
        username,
        host,
        port,
        path
    }
}

const program = new Command()
program
    .name('n-upload')
    .argument('<source>', '本地文件/路径')
    .argument('<target>', '目标文件/路径')
    .option('-p, --password <string>', '登录密码')
    .allowUnknownOption()

async function execute(ctx, command) {
    const argv = command.split(' ').filter(it => it)
    program.parse(['node', ...argv])
    const [source, target] = program.processedArgs
    const opts = parseTarget(target)
    opts.password = program.opts().password
    return await upload.call(ctx, source, opts.path, opts)
}

module.exports = execute
