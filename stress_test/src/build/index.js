const WebSocket = require('ws');
const Logger = require('../utils/Logger');

const Build = (url, buildBody, callback) => {

    const client = new WebSocket(url);
    let start;

    client.on('open', (res) => {
        start = new Date();
        Logger.log(`Response: ${res}`);
        callback({
            type: "log",
            callback: "Opening"
        });
        client.send(buildBody);
    });

    client.on('message', (res) => {
        Logger.log(`Response: ${res}`);
        let parsedResponse = JSON.parse(res);
        if (parsedResponse.type === "build") {
            console.log("Closing");
            let end = new Date() - start;
            client.close();
            callback({
                type: "done",
                payload: {
                    duration: end
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

module.exports = Build;