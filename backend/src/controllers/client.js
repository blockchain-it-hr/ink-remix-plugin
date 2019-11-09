const services = require('../services/index');
const uuid = require('uuid4');
const fs = require('fs');
const InsufficientPermissions = require('../errors/errors').InsufficientPermissionsError;

class Client {
    // List of methods exposed by the client (required for error checking)
    constructor(services) {
        this.services = services || []
    }

    register(service) {
        this.services.push(service)
    }

    validatePermissions(permissions) {
        if (permissions.length === 0) {
            return
        }

        const permissionsEnabled = process.env.PERMISSIONS.split(',');

        permissions.forEach(permission => {
            if (permissionsEnabled.indexOf(permission) === -1) {
                throw new InsufficientPermissions(`Insufficient permissions for command`)
            }
        })
    }

    call(message, send) {
        const {service, fn, args, permissions} = message;
        try {
            //this.validatePermissions(permissions) //For checking and requesting needed permissions from users //TODO: Update when Remix implements this
            const func = this.services[service][fn];
            args.workingDirectory = uuid();
            //Create directory if directory does not exist
            const dir = './storage/' + args.workingDirectory;
            args.projectName = "test"; //TODO: update
            args.dir = dir;
            if (!fs.existsSync(dir)) {
                this.services[service]["init"](args, (error, result) => {
                    console.log(result)
                });
            }
            func(args, (error, result) => {
                send({scope: service, fn, error, result})
            })
        } catch (error) {
            send({scope: service, fn, error: error.message, result: null})
        }
    }
}

const client = new Client(services);
module.exports = client;
