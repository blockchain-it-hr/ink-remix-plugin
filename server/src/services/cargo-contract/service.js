const fs = require('fs');
const path = require('path');
const uuid = require('uuid4');
const Logger = require('../../utils/Logger');
const CargoContractManager = require('./manager');

class CargoContractService {

    constructor() {
        this.cargoContractManager = new CargoContractManager();
        this.storageDirectory = path.resolve(__dirname, '../../storage/');
    }

    create(args, callback) {
        const {projectName} = args;
        if (!projectName.match(/^[a-zA-Z0-9_]+$/g)) {
            throw new Error("Invalid project name");
        }

        const projectId = uuid();
        const workspaceDirectory = path.join(this.storageDirectory, projectId);
        const projectPath = path.join(workspaceDirectory, projectName);

        Logger.log(`Creating "${projectName}" (projectId: ${projectId})`);
        this.cargoContractManager.create(projectName, workspaceDirectory, callback, () => {
            try {
                const libPath = path.join(projectPath, "lib.rs");
                const cargoPath = path.join(projectPath, "Cargo.toml");

                const lib = fs.readFileSync(libPath).toString();
                const cargo = fs.readFileSync(cargoPath).toString();

                Logger.log(`Created "${projectName}" (projectId: ${projectId})`);
                callback({
                    type: "project",
                    payload: {
                        projectId, projectName, lib, cargo
                    }
                });
            } catch (e) {
                callback({type: "error", payload: e.toString()});
            }
        });
    }

    build(args, callback) {
        const {projectId, projectName, lib, cargo} = args;
        const workspaceDirectory = path.join(this.storageDirectory, projectId);
        const projectPath = path.join(workspaceDirectory, projectName);

        const buildClosure = () => {
            Logger.log(`Building "${projectName}" (projectId: ${projectId})`);

            const libPath = path.join(projectPath, "lib.rs");
            const cargoPath = path.join(projectPath, "Cargo.toml");

            fs.writeFileSync(libPath, lib);
            fs.writeFileSync(cargoPath, cargo);

            this.cargoContractManager.build(projectPath, callback, () => {
                try {
                    const wasmPath = path.join(projectPath, "target", `${projectName}.wasm`);
                    const abiPath = path.join(projectPath, "target", "metadata.json");

                    const wasmEncoded = fs.readFileSync(wasmPath).toString('base64');
                    const abi = fs.readFileSync(abiPath).toString();

                    Logger.log(`Finished building "${projectName}" (projectId: ${projectId})`);
                    callback({
                        type: "build",
                        payload: {
                            wasm: wasmEncoded,
                            abi
                        }
                    });
                } catch (e) {
                    callback({type: "error", payload: e.toString()});
                }
            });
        }

        if (!fs.existsSync(projectPath)) {
            Logger.log(`Creating "${projectName}" (projectId: ${projectId})`);
            this.cargoContractManager.create(
                projectName,
                workspaceDirectory,
                callback,
                buildClosure.bind(this)
            );
        } else {
            buildClosure.call(this);
        }
    }
}

const cargoContractService = new CargoContractService();
module.exports = cargoContractService;
