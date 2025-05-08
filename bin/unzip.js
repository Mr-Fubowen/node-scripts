#!/usr/bin/env node

const { Command } = require('commander')
const { unzip } = require('./lib')

const program = new Command()
program
    .name('n-unzip')
    .argument('<source>', '本地文件/路径')
    .argument('<target>', '目标文件/路径')
    .option('-f, --isFile', '文件', false)
    .option('-p, --password <string>', '登录密码')
    .allowUnknownOption()
    .action(unzip)

async function execute(ctx, command) {
    const argv = command.split(' ').filter(it => it)
    program.parse(['node', ...argv])
    const [source, target] = program.processedArgs
    const options = program.opts()
    return unzip.call(ctx, source, target, options)
}

module.exports = execute
