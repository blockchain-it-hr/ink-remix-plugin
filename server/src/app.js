#!/usr/bin/env node

const path   = require('path');
const dotenv = require('dotenv');
const Logger = require('./utils/Logger');

// env
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env')});
process.env.ORIGINS = require('./origins.json')
process.on('uncaughtException', (e) => {
    Logger.log('UncaughtException: ' + e.toString(), 'error');
});

// router
Logger.log('Starting server...')
require('./router')

