const {spawn} = require('child_process')
const fs = require('fs');

class CargoContract {

    constructor() {
    }

    init(args, callback) {
        if (!fs.existsSync(args.dir)) {
            fs.mkdirSync(args.dir);
        }

        const options = {cwd: args.dir, shell: true};
        const cmd = `cargo-contract contract new ${args.projectName}`;
        const child = spawn(cmd, options);
        child.stdout.on('data', (buffer) => {
            callback(null, {chunk: `${buffer}`})
        });
        child.stderr.on('data', (buffer) => {
            callback(`stderr: ${buffer}`)
        })
    }

    execute(args, callback) {
        const options = {cwd: `${args.workingDirectory}/${args.projectName}`, shell: true};
        const {cmd} = args.cmd;
        const child = spawn(cmd, options);
        child.stdout.on('data', (buffer) => {
            callback(null, {chunk: `${buffer}`})
        });
        child.stderr.on('data', (buffer) => {
            callback(`stderr: ${buffer}`)
        })
    }
}

const cargoContract = new CargoContract();
module.exports = cargoContract;
