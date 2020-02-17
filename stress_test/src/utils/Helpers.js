const fs = require('fs');
const path   = require('path');

class Helpers {

    static readFile(fileName) {
        let fullPath = path.resolve(__dirname, `../../${fileName}`);
        return fs.readFileSync(fullPath);
    }

    static writeToFile(fileName, id) {
        let fullPath = path.resolve(__dirname, `../../${fileName}`);
        return fs.appendFileSync(fullPath,`${id}\n`);
    }
}

module.exports = Helpers;