const assert = require("assert");
const cargoContractService = require('../src/services/cargo-contract/service');
const cargoContractManager = require('../src/services/cargo-contract/manager');
const chai = require("chai");
const expect = chai.expect;
const path = require('path');
const uuid = require('uuid4');
const fs = require('fs');
const example = require('./example');


describe('cargo-contract service.js', () => {
    describe('create function', () => {
        it('should throw error when projectName is invalid', function () {
            expect(function () {
                cargoContractService.create({projectName: "!"}, () => {
                })
            }).to.throw("Invalid project name");
        });
        it('should pass when projectName is valid', function () {
            expect(function () {
                cargoContractService.create({projectName: "validName"}, () => {
                })
            }).to.not.throw("Invalid project name");
        });
    });

    describe('callback in calling cargoContractManager.build', () => {
        before(function (done) {
            this.timeout(3600000);
            args = JSON.parse(example);
            const abiPath = "./src/storage/961c80e2-72a9-4bfb-b33e-ccfc36ad302f/debug/target/metadata.json";

            cargoContractService.build({
                projectId: args.projectId,
                projectName: args.projectName,
                lib: args.lib,
                cargo: args.cargo
            }, (result) => {
                if (Object.values(result).indexOf('build') > -1) {
                    done();
                }
            });
        });

        it('should be able to find target of built project', function () {
            const wasmPath = "./src/storage/961c80e2-72a9-4bfb-b33e-ccfc36ad302f/debug/target/debug.wasm";
            const abiPath = "./src/storage/961c80e2-72a9-4bfb-b33e-ccfc36ad302f/debug/target/metadata.json";
            assert.ok(fs.readFileSync(wasmPath).toString('base64'));
            assert.ok(fs.readFileSync(abiPath).toString());
        });
    });
});

describe('cargo contract manager.js', function () {
    before(function (done) {
        projectName = "1234";
        workspaceDirectory = "./test/storage";
        projectDirectory = "./test/storage/1234";
        libPath = "./test/storage/1234/lib.rs";
        cargoPath = "./test/storage/1234/Cargo.toml";
        cargoContractService.cargoContractManager.create(projectName, workspaceDirectory, () => {
            done();
        }, null);
    });
    it('should complete build function without errors', function () {
        expect(function () {
            cargoContractService.cargoContractManager.build(projectDirectory, null, null)
        }).to.not.throw(Error);
    });
    it('should create storage with Cargo.toml and lib.rs in workspaceDirectory', function () {
        assert.ok(fs.readFileSync(libPath));
        assert.ok(fs.readFileSync(cargoPath));
    });
});
