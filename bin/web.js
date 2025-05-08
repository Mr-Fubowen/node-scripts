#!/usr/bin/env node

const { Command } = require('commander')
const { executeScript } = require('./executor')
const { join } = require('path')

const program = new Command()
program
    .name('n-web')
    .option('-v, --view', '查看内容')
    .option('-e, --environment <string>', '环境变量, 例:a=1,b=2,c=3...')
    .allowUnknownOption(true)
    .action(options => {
        const scriptPath = join(__dirname, '../scripts/nginx-publish.sh')
        executeScript(scriptPath, options)
    })
program.parse(process.argv)
