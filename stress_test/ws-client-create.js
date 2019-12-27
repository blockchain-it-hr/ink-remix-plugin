const WebSocket = require('ws');
const fs = require('fs');

const file_name="test_create_input.file";
const output_file_name="ids.txt";
const url="wss://server.staging.ink-remix.blockchain-it.hr/new";


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
    if (parsedResponse.type === "project") {
        let id = parsedResponse.payload.projectId;
        writeToFile(id);
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

function writeToFile(id) {
    return fs.appendFileSync(__dirname + `/${output_file_name}`, `${id}\n`);
}