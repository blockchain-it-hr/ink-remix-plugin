#!/usr/bin/env node

const path   = require('path');
const dotenv = require('dotenv');
const Logger = require('./utils/Logger');

// env
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env')});
process.env.ORIGINS = require('./origins.json')
Logger.log("Origins:" + process.env.ORIGINS)

// router
Logger.log('Starting server...')
require('./router')
