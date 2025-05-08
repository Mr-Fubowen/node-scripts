const colors = require('colors-console')
const { format } = require('date-fns')
const util = require('util')

function now(dateFormat = 'yyyy-MM-dd HH:mm:ss') {
    const now = new Date()
    return format(now, dateFormat)
}

function appendConsole(level, text) {
    let time = colors('grey', now())
    let type
    switch (level) {
        case 'INF':
            text = colors('blue', text)
            type = colors('blue', level)
            break
        case 'WAN':
            text = colors('yellow', text)
            type = colors('yellow', level)
            break
        case 'ERR':
            text = colors('red', text)
            type = colors('red', level)
            break
    }
    const msg = util.format('%s [%s] %s', time, type, text)
    console.log(msg)
}

function info(text) {
    appendConsole('INF', text)
}

function warn(text) {
    appendConsole('WAN', text)
}

function error(text) {
    appendConsole('ERR', text)
}

function text(text, title) {
    text = colors('green', text)
    title = colors('blue', title)
    const msg = util.format('\n%s\n\n%s\n', title, text)
    console.log(msg)
}

function mapLog(map, title) {
    if (title) {
        let msg = util.format('\n%s\n ', title)
        console.log(msg)
    }
    let len = 0
    map.forEach((_, key) => {
        len = Math.max(key.length, len)
    })
    map.forEach((value, key) => {
        let label = colors('blue', key.padEnd(len, ' '))
        if (value) {
            value = colors('green', value)
        } else {
            value = colors('red', 'null')
        }
        let msg = util.format('%s: %s', label, value)
        console.log(msg)
    })
    console.log('\n')
}

module.exports = {
    info,
    warn,
    error,
    text,
    mapLog
}
