const { createLogger, format, transports, config } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const moment = require('moment');
const chalk = require('chalk');
const { log } = require('../helper/logger');

const APILOGGER = createLogger({
    level: 'info',
    format: format.combine(
        format.printf(({ level, message }) => JSON.stringify({ level, message }))
    ),
    transports: [
        new DailyRotateFile({
            filename: 'log/api/%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m'
        })
    ]
});

const ERRORLOGGER = createLogger({
    level: 'error',
    format: format.combine(
        format.printf(({ level, message }) => JSON.stringify({ level, message }))
    ),
    transports: [
        new DailyRotateFile({
            filename: 'log/error/%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m'
        })
    ]
});

const APILOG = (req, res, next) => {
    let from = req.headers['x-forwarded-for'] || req.ip
    from = from?.substring(from.lastIndexOf(':') + 1, from.length) || 'unknown'
    APILOGGER.info({ api: req.url, time: moment(Date.now()).format('DD/MM/YYYY h:mm:ss A'), timestamp: Date.now(), from: from })
    next()
}


const ERRORLOG = ({ msg }) => {
    ERRORLOGGER.error({ msg: msg, time: moment(Date.now()).format('DD/MM/YYYY h:mm:ss A') })
}


module.exports = {
    APILOG: APILOG,
    ERRORLOG: ERRORLOG
}