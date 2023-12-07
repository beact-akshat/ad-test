const express = require('express')
const helmet = require('helmet');
const bodyParser = require('body-parser')
require('dotenv').config()
const chalk = require('chalk')
const moment = require('moment')
const route = require('./route')
const app = express()
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const { ERRORLOG } = require('./middleware/logger')
const { NODE_ENV } = process.env;

const PORT = process.env.PORT || '6363'
const HOST = process.env.HOST || 'localhost'

// set headers for cors and others uses
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.set('Cache-Control', 'no-store, no-cache')
    res.set('Expires', '0')
    next()
});

// Use helmet middleware with CSP
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", 'https://ad-test-n94k.onrender.com', 'https://tpc.googlesyndication.com', 'https://pagead2.googlesyndication.com', 'blob:', 'data:', 'https://csi.gstatic.com/csi', 'https://fonts.googleapis.com/css', 'https://fonts.googleapis.com/css2', 'https://vr.google.com/shaders/w/techspecs/']
        },
    })
);


// all routes attach to server
app.use('/api', route)

const time = moment(Date.now()).format('hh:mm:ss')

// server connection
const server = app.listen(PORT)

server.on('error', data => {
    console.log(chalk.red(data.name), ':', chalk.red(data.message))
    process.exit()
})
server.on('listening', () => {
    console.log(chalk.bold(chalk.red(NODE_ENV)), chalk.yellow('server on =>'), chalk.magenta(`http://${HOST}:${PORT}`), chalk.red(time));
})

// heath check API route
app.get('/api/health', async (req, res) => {
    res.status(200).send({ code: 200, success: true, message: 'ok' })
});


// prevent all other APIs
app.use('*', async (req, res) => {
    res.status(405).send({ code: 405, success: false, message: 'Api Not Found!' })
});


//uncatch error handle to prevent server crash
process.on('uncaughtException', ((err, data) => {
    ERRORLOG({ msg: err.message })
}));
