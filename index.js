#!/usr/bin/env node

const { Command } = require('commander')
const executor = require('./bin/executor')

const program = new Command()
program
    .name('n')
    .argument('<path>', '脚本路径')
    .option('-v, --view', '查看内容')
    .option('-e, --environment <string>', '环境变量, 例:a=1,b=2,c=3...')
    .option('-c, --cron <string>', '定时执行, 例:30 * * * * *')
    .allowUnknownOption(true)
    .action((path, options) => {
        executor.executeScript(path, options)
    })
program.parse(process.argv)
