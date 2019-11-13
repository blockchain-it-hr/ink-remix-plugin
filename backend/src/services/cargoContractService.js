const {spawn} = require('child_process')
const fs = require('fs');
const path = require('path');

class CargoContractService {

    constructor() {}

    mkdir(dir){
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    create(dir){
        const options = {cwd: dir, shell: true};
        const cmd = `cargo-contract contract new ${projectName}`;
        const child = spawn(cmd, options);
        return child;
    }

    build(projectPath){
        const options = {cwd: projectPath, shell: true};
        const cmd = "cargo-contract contract build && cargo +nightly run -p abi-gen";
        return spawn(cmd, options);
    }

    deploy(){
        //TODO:
    }
}

const cargoContractService = new CargoContractService();
module.exports = cargoContractService;
