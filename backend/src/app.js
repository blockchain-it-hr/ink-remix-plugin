#!/usr/bin/env node
const path = require('path');
const dotenv = require('dotenv');
const origins = require('./origins.json');
dotenv.config(
    {
        path: path.resolve(process.cwd(), 'backend/.env')
    }
);

process.env.ORIGINS = origins;

require('./routes/index');