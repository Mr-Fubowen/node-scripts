#!/usr/bin/env node

const { Command } = require('commander')
const { commit } = require('./lib')

const program = new Command()
program
    .name('n-commit')
    .argument('<path>', 'Git 仓库路径')
    .option('-r, --remark', '提交信息', '')
    .allowUnknownOption()

async function execute(ctx, command) {
    const argv = command.split(' ').filter(it => it)
    program.parse(['node', ...argv])
    return await commit.call(ctx, ...program.processedArgs, program.opts())
}

module.exports = execute
