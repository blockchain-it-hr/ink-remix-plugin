const WebSocket = require('ws');
const Logger = require('../utils/Logger');

const Create = (url, createBody, callback) => {

    const client = new WebSocket(url);
    let start;

    client.on('open', (res) => {
        start = new Date();
        Logger.log(`Response: ${res}`);
        callback({
            type: "log",
            callback: "Opening"
        });
        client.send(createBody);
    });

    client.on('message', (res) => {
        Logger.log(`Response: ${res}`);
        let parsedResponse = JSON.parse(res);
        if (parsedResponse.type === "project") {
            let id = parsedResponse.payload.projectId;
            Logger.log("Closing");
            client.close();
            let end = new Date() - start;
            console.info('Execution time: %dms', end);
            callback({
                type: "done",
                payload: {
                    duration:  end,
                    id: id
                }
            });
        }
    });

    client.on('error', (error) => {
        callback({
            type: "error",
            payload: error
        })
    });

};

module.exports = Create;
