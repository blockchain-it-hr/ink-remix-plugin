const client = require('../controllers/client');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
require('express-ws')(app);
const ErrorHandler = require('../errors/errors').ErrorHandler;

class Router {
    constructor() {
        // Middleware
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

        const port = process.env.PORT || 65520;

        app.listen(port, () => console.log(`Server started on port ${port}`));

        this.app = app;
    }

    static validateRequest(request) {
        // Origin has to be in the list of whitelisted!
        if (process.env.ORIGINS.indexOf(request.headers.origin) === -1) {
            throw new Error('InvalidCORS')
        }
        console.log("CORS validation passed!")
    }
}

const router = new Router();

router.app.ws('/build', async (socket, req) => {
    try {
        Router.validateRequest(req);
        socket.on('message', (message) => {
            console.log(`Received message ${message} from user ${client}`);
            const data = JSON.parse(message);
            client.call(data, (result) => {
                console.log(JSON.stringify(result));
                socket.send(JSON.stringify(result))
            })
        })
    } catch (e) {
        return socket.send(JSON.stringify(ErrorHandler(e, socket)));
    }

});

router.app.ws('/test', async (socket, req) => {
    //TODO:
});

router.app.ws('/deploy', async (socket, req) => {
    //TODO:
});

module.exports = Router;