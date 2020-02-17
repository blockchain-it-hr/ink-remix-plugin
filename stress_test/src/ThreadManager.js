const { spawn } = require('child_process');

class ThreadManager {

    static spawnProcess(cmd, options, callback) {
        const child = spawn(cmd, options);
        child.on('error', (err) => callback({type: "error", payload: `${err.toString()}`}));

        if (callback) {
            child.stdout.on('data', (data) => callback({type: "stdout", payload: `${data}`}));
            child.stderr.on('data', (error) => callback({type: "stderr", payload: `${error}`}));
        }

        child.on('close', (exitCode) => {
            if (exitCode !== 0) {
                callback({type: "error", payload: `Child process exited with code ${exitCode}`});
            }
            callback({type: "done", payload: `Finished execution with code ${exitCode}`});
        });
    }

}

module.exports = ThreadManager;
