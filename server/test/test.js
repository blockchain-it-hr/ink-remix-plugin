
const assert = require("assert");
const cargoContractService = require('../src/services/cargo-contract/service');
const cargoContractManager = require('../src/services/cargo-contract/manager');
const chai = require("chai");
const expect = chai.expect;
const path = require('path');
const uuid = require('uuid4');
const fs = require('fs');


describe('cargo-contract service.js', () => {
    describe('create function', () => {
        it('should throw error when projectName is invalid', function() {
            expect(function() {cargoContractService.create({projectName: "!"}, () => {})}).to.throw("Invalid project name");
        });
        it('should pass when projectName is valid', function() {
            expect(function() {cargoContractService.create({projectName: "validName"}, () => {})}).to.not.throw("Invalid project name");
        });
    });

    describe('callback in calling cargoContractManager.build', () => {
        it('should be able to find target', function () {
            projectPath = "./src/storage/39f365ca-3500-41f4-b6f1-72506be0f21d";
            projectName = "validName";
            const wasmPath = path.join(projectPath, "target", `${projectName}.wasm`);
            const wasmEncoded = fs.readFileSync(wasmPath).toString('base64');
            const abi = fs.readFileSync(abiPath).toString();
        });
    });
});

describe('cargo contract manager.js', function () {
    before(function () {
        projectName = "validName";
        workspaceDirectory = "./";
    });
    it('should complete build function without errors', function () {
        expect(function() {cargoContractService.cargoContractManager.build(workspaceDirectory, null , null)}).to.not.throw(Error);
    });
    it('should create storage in workspaceDirectory', function () {
        assert.ok(fs.existsSync("./storage"));
    });

});
