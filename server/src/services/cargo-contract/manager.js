const { spawn } = require('child_process')
const fs = require('fs');

class CargoContractManager {

    create(name, path, callback, onclose) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        } 
        const options = { cwd: path, shell: true };
        const cmd = `cargo contract new "${name}"`;
        this.spawnProcess(cmd, options, callback, onclose);
    }

    build(path, callback, onclose) {
        const options = { cwd: path, shell: true };
        const cmd = "cargo contract build && cargo contract generate-metadata";
        this.spawnProcess(cmd, options, callback, onclose);
    }

    spawnProcess(cmd, options, callback, onclose) {
        const child = spawn(cmd, options);
        child.on('error', (err) => callback({ type: "error", payload: `${err.toString()}` }));

        if (callback) {
            child.stdout.on('data', (data)  => callback({ type: "stdout", payload: `${data}` }));
            child.stderr.on('data', (error) => callback({ type: "stderr", payload: `${error}` }));
        }

        if (onclose) {
            child.on('close', (exitCode) => {
                if (exitCode != 0) {
                    callback({ type: "error", payload: `Child process exited with code ${exitCode}` });
                    return;
                }
                onclose();
            });
        }
    }
}

module.exports = CargoContractManager;
