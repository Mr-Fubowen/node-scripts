#!/usr/bin/env node

const { Command } = require('commander')
const { backup } = require('./lib')

const program = new Command()
program
    .name('n-zip')
    .argument('<source>', '服务器文件/路径')
    .option('-f, --isFile', '文件', false)
    .option('-v, --isVersion', '备份名称是版本还是时间', false)
    .allowUnknownOption()

async function execute(ctx, command) {
    const argv = command.split(' ').filter(it => it)
    program.parse(['node', ...argv])
    return await backup.call(ctx, ...program.processedArgs, program.opts())
}

module.exports = execute
