const { format } = require('date-fns')

function now(dateFormat = 'yyyy-MM-dd HH:mm:ss') {
    const now = new Date()
    return format(now, dateFormat)
}

module.exports = {
    now
}
