#!/usr/bin/env node

const path   = require('path');
const dotenv = require('dotenv');
const Logger = require('./utils/Logger');
const Helpers = require('./utils/Helpers');

const createUrl = "wss://server.staging.ink-remix.blockchain-it.hr/new";
const buildUrl = "wss://server.staging.ink-remix.blockchain-it.hr/build";

const createFileName = "createInput.file";
const buildFileName = "buildInput.file";
const idsFileName = "ids.file";

// env
dotenv.config({ path: path.resolve(process.cwd(), '.env')});
process.on('uncaughtException', (e) => {
    Logger.log('UncaughtException: ' + e.toString(), 'error');
});

Logger.log('Starting Stress Test...');

const Create = require('./create');
const Build = require('./build');

//Now do testing with parallel threads
const createBody = Helpers.readFile(createFileName);

//Spawn this in thread
const create = Create(createUrl, createBody, (result) => {
    if(result.type === 'done'){
        Helpers.writeToFile(idsFileName, result.payload.id);
    }
    console.log(result);
});

//After Create has been finished do builds
const buildBody = Helpers.readFile(buildFileName);
const ids = Helpers.readFile(idsFileName);

const build = Build(buildUrl, buildBody, (result) => {
    console.log(result);
});