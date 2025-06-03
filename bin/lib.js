const compressing = require('compressing')
const { SSHClient } = require('node-ssh-plus')
const fs = require('fs-extra')
const util = require('util')
const simpleGit = require('simple-git')
const { now } = require('../utils/time')

function existOrthrow(value, msg, ...args) {
    if (!value) {
        throw new Error(util.format(msg, ...args))
    }
}

async function zip(source, target, options) {
    existOrthrow(source, '缺少 source 参数')
    existOrthrow(target, '缺少 target 参数')
    const has = await fs.pathExists(source)
    existOrthrow(has, '%s 不存在', source)
    if (options.isFile) {
        await compressing.tgz.compressFile(source, target)
    } else {
        await compressing.tgz.compressDir(source, target)
    }
    return target
}

async function unzip(source, target) {
    existOrthrow(source, '缺少 source 参数')
    existOrthrow(target, '缺少 target 参数')
    const has = await fs.pathExists(source)
    existOrthrow(has, '%s 不存在', source)
    await compressing.tgz.uncompress(source, target)
    return target
}

async function login(options) {
    existOrthrow(options.host, '缺少 host 参数')
    existOrthrow(options.port, '缺少 port 参数')
    existOrthrow(options.username, '缺少 username 参数')
    const has = options.password || options.privateKey || options.privateKeyPath
    existOrthrow(has, '参数 password | privateKey | privateKeyPath 至少包含一个')
    this.ssh = await SSHClient.connect(options)
    return this.ssh
}

async function upload(source, target, options) {
    existOrthrow(options.host, '缺少 host 参数')
    existOrthrow(options.port, '缺少 port 参数')
    existOrthrow(options.username, '缺少 username 参数')
    const has = options.password || options.privateKey || options.privateKeyPath
    existOrthrow(has, '参数 password | privateKey | privateKeyPath 至少包含一个')
    const ssh = await SSHClient.connect(options)
    try {
        await ssh.upload(source, target)
    } finally {
        ssh.close()
    }
    return target
}

async function text(source, content) {
    existOrthrow(source, '缺少 source 参数')
    await fs.outputFile(source, content, 'utf-8')
    return util.format('向 %s 写入 %s', source, content)
}

async function json(source, name) {
    existOrthrow(source, '缺少 source 参数')
    existOrthrow(name, '缺少 name 参数')
    const has = await fs.pathExists(source)
    existOrthrow(has, '%s 不存在', source)
    this[name] = await fs.readJson(source, 'utf-8')
    return util.format('将 %s 读取到变量 %s 成功', source, name)
}

async function backup(source, options) {
    existOrthrow(source, '缺少 source 参数')
    existOrthrow(this.ssh, '请使用 n-login 命令登录')
    if (options.isVersion) {
        return await this.ssh.createBackupOfVersion(source, options.isFile)
    }
    return await this.ssh.createTimePointBackup(source, options.isFile)
}

async function commit(path, options) {
    existOrthrow(path, '缺少 Git 仓库路径参数')
    const has = await fs.pathExists(path)
    existOrthrow(has, '目标路径不存在 Git 仓库')
    const git = simpleGit(path)
    const status = await git.status()
    const hasChanged =
        status.not_added.length > 0 ||
        status.modified.length > 0 ||
        status.deleted.length > 0 ||
        status.renamed.length > 0
    if (!hasChanged) {
        return '没有需要提交的内容，取消提交...'
    }
    await git.add('.')
    await git.commit(options.remark + now())
    await git.push()
    const log = await git.log({ n: 1 })
    return {
        hash: log.latest.hash,
        author: log.latest.author_name,
        date: log.latest.date,
        message: log.latest.message,
        email: log.latest.author_email
    }
}

module.exports = {
    zip,
    unzip,
    login,
    upload,
    text,
    json,
    backup,
    commit
}
