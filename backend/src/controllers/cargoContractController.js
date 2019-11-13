const cargoContractService = require('../services/cargoContractService');

class CargoContractController {

    constructor() {}

    create(projectName, callback) {
        const dir = path.resolve(__dirname, '../../storage/', sessionID);
        cargoContractService.mkdir(dir);
        const child = cargoContractService.create(dir);
        callback({type: "newSession", sessionID});
        child.stdout.on('data', (buffer) => {
            callback({type: "log", chunk: `${buffer}`})
        });
        child.stderr.on('data', (buffer) => {
            callback({type: "error", message: `stderr: ${buffer}`})
        })
    }

    build(sessionID, projectName, callback){
        if(cargoContractService.mkdir())
  
        const projectPath = path.resolve(__dirname, '../../storage/', sessionID, projectName);
  
        const child = cargoContractService.build(projectPath)
        callback({type: "buildProject", sessionID, projectName});
        child.stdout.on('data', (buffer) => {
            callback({type: "log", chunk: `${buffer}`})
        });
        child.stderr.on('data', (buffer) => {
            callback({type: "error", message: `stderr: ${buffer}`})
        });
        child.on('close', (code) => { 
            const wasm = fs.readFileSync(path.resolve(projectPath, "target", `${projectName}.wasm`));
            const abi = fs.readFileSync(path.resolve(projectPath, "target", `abi.json`));
            const wasm_base64 = Buffer.from(wasm).toString('base64');
            const abi_base64 = Buffer.from(abi).toString('base64');
            callback({type: "build", code: code, wasm: wasm_base64, abi: abi_base64})
        })
    }


}

const cargoContractController = new CargoContractController();
module.exports = cargoContractController;
