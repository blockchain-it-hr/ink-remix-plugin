const {spawn} = require('child_process')
const fs = require('fs');
const path = require('path');
const uuid = require('uuid4');

class CargoContractService {

    constructor() {}

    create(projectName, callback){
        const sessionID = uuid();
        const dir = path.resolve(__dirname, '../../storage/', sessionID);
        const options = {cwd: dir, shell: true};
        const cmd = `cargo-contract contract new ${projectName}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const child = spawn(cmd, options);
        callback({type: "newSession", sessionID});
        child.stdout.on('data', (buffer) => {
            callback({type: "log", chunk: `${buffer}`})
        });
        child.stderr.on('data', (buffer) => {
            callback({type: "error", message: `stderr: ${buffer}`})
        })
    }

    build(sessionID, projectName, callback){
        const projectPath = path.resolve(__dirname, '../../storage/', sessionID, projectName);
        const options = {cwd: projectPath, shell: true};
        const cmd = "cargo-contract contract build && cargo +nightly run -p abi-gen";

        const child = spawn(cmd, options);
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

    deploy(){
        //TODO:
    }

    init(args, callback) {
        
    }

    execute(args, callback) {
        const options = {cwd: `${args.dir}/${args.projectName}`, shell: true};
        const cmd = args.cmd;
        const child = spawn(cmd, options);
        child.stdout.on('data', (buffer) => {
            callback(null, {chunk: `${buffer}`})
        });
        child.stderr.on('data', (buffer) => {
            callback(`stderr: ${buffer}`)
        })
    }
}

const cargoContractService = new CargoContractService();
module.exports = cargoContractService;
