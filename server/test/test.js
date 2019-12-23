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
        before(function () {
            //cargoContractService.build( {projectId: "123", projectName: "testProject", lib: "lib", cargo: "cargo"}, (result) => {} );
        });
        /*it('should be able to find target of built project', function () {
            args = JSON.parse(example);

            cargoContractService.build({
                projectId: args.projectId,
                projectName: args.projectName,
                lib: args.lib,
                cargo: args.cargo
            }, (result) => {
                /!*projectPath = "./src/storage/123";
                projectName = "testProject";
                const wasmPath = "./src/storage/123/testProject/target/testProject.wasm";
                const abiPath = "./src/storage/123/testProject/target/metadata.json";*!/
                /!*if(result = ""){
                    /!*assert.ok(fs.readFileSync(wasmPath).toString('base64'));
                    assert.ok(fs.readFileSync(abiPath).toString());*!/
                }*!/

            });
        });*/
    });
});

describe('cargo contract manager.js', function () {
    before(function () {
        projectName = "1234";
        workspaceDirectory = "./test/storage";
        projectDirectory = "./test/storage/1234";
        libPath = "./test/storage/1234/lib.rs";
        cargoPath = "./test/storage/1234/Cargo.toml";
        cargoContractService.cargoContractManager.create(projectName, workspaceDirectory, null, null);
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
