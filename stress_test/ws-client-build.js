const WebSocket = require('ws');
const fs = require('fs');

//file_name="test_build_input.file"
//url="wss://server.staging.ink-remix.blockchain-it.hr/new"

const file_name="test_build_input.file";
const url = "wss://server.staging.ink-remix.blockchain-it.hr/build";

const client = new WebSocket(url);
console.time("duration");

client.on('open', (res) => {
    //console.log(`Response: ${res}`);
    let fileContent = readFile();
    console.log("Opening");
    client.send(fileContent);
});

client.on('message', (res) => {
    //console.log(`Response: ${res}`);
    let parsedResponse = JSON.parse(res);
    if (parsedResponse.type === "build") {
        console.log("Closing");
        console.timeEnd('duration');
        client.close();
    }
});

client.on('error', (error) => {
    //console.log(`Error: ${error}`);
});

function readFile() {
    return fs.readFileSync(__dirname + `/${file_name}`);
}