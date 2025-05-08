#!/usr/bin/env node

const { Command } = require('commander')
const { text } = require('./lib')

const program = new Command()
program
    .name('n-text')
    .argument('<source>', '本地文件/路径')
    .argument('<target>', '文件内容')
    .allowUnknownOption()

async function execute(ctx, command) {
    const argv = command.split(' ').filter(it => it)
    program.parse(['node', ...argv])
    return await text.call(ctx, ...program.processedArgs, program.opts())
}

module.exports = execute
