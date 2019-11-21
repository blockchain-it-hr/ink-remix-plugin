const { cargoContractService } = require('../services');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Logger = require('../utils/Logger');
require('express-ws')(app);

const socketErrorHandler = (err) => JSON.stringify({ type: "error", payload: err.toString() });
const Router = (app, port) => {

    // Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Start listener
    app.listen(port, () => Logger.log(`Server started on port ${port}`));

    app.ws('/new', async (socket) => {
        socket.on('message', (message) => {
            try {
                const args = JSON.parse(message);
                cargoContractService.create(args, (result) => {
                    socket.send(JSON.stringify(result));
                });
            } catch (e) {
                socket.send(socketErrorHandler(e));
            }
        });
    });

    app.ws('/build', async (socket) => {
        socket.on('message', (message) => {
            try {
                const args = JSON.parse(message);
                cargoContractService.build(args, (result) => {
                    socket.send(JSON.stringify(result));
                });
            } catch (e) {
                socket.send(socketErrorHandler(e));
            }
        });
    });

    app.ws('/deploy', async () => {
        // TODO: Implement deploy logic
    });
}

const router = Router(app, process.env.SERVER_PORT || 65520);
module.exports = router;
