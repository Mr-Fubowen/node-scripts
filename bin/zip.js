#!/usr/bin/env node

const { Command } = require('commander')
const { zip } = require('./lib')

const program = new Command()
program
    .name('n-zip')
    .argument('<source>', '本地文件/路径')
    .argument('<target>', '目标文件/路径')
    .option('-f, --isFile', '文件', false)
    .allowUnknownOption()

async function execute(ctx, command) {
    const argv = command.split(' ').filter(it => it)
    program.parse(['node', ...argv])
    return await zip.call(ctx, ...program.processedArgs, program.opts())
}

module.exports = execute
