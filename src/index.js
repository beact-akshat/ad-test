const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const chalk = require('chalk');
const moment = require('moment');
const route = require('./route');
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const { NODE_ENV } = process.env;

const PORT = process.env.PORT || '6363';
const HOST = process.env.HOST || 'localhost';

// app.use(
//     helmet({
//         contentSecurityPolicy: false,
//     })
// )

// // Set headers for CORS and other uses
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', '*');
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     res.set('Cache-Control', 'no-store, no-cache');
//     res.set('Expires', '0');
//     next();
// });


// Use routes attached to the server
app.use('/api', route);

// Health check API route
app.get('/api/health', async (req, res) => {
    res.status(200).send({ code: 200, success: true, message: 'OK' });
});

// Prevent all other APIs
app.use('*', async (req, res) => {
    res.status(405).send({ code: 405, success: false, message: 'API Not Found!' });
});

// Uncatch error handle to prevent server crash
process.on('uncaughtException', (err) => {
    console.error({ msg: err.message });
    process.exit(1); // Exit process on uncaught exception
});

// Server connection
const server = app.listen(PORT);

server.on('error', (err) => {
    console.error(chalk.red(err.name), ':', chalk.red(err.message));
    process.exit(1); // Exit process on server error
});

server.on('listening', () => {
    console.log(chalk.bold(chalk.red(NODE_ENV)), chalk.yellow('Server on =>'), chalk.magenta(`http://${HOST}:${PORT}`), chalk.red(moment(Date.now()).format('hh:mm:ss')));
});
