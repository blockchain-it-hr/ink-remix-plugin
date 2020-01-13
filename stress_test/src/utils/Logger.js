class Logger {

    static log(message, scope = 'server') {
        const date = new Date().toString();
        const format = `[\x1b[1;32m${scope}\x1b[0m] ${date} -- ${message}`;
        console.log(format);
    }
}

module.exports = Logger;