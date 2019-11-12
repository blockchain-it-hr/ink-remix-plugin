const responseModel = require('../models/index').responseModel

class BadRequest extends Error {
    constructor(message) {
        super()
        this.message = message;
        this.code = 400
        this.type = 'BadRequest';
    }
}

class UnsupportedCommandError extends Error {
    constructor(message) {
        super()
        this.message = message
        this.code = 404
        this.type = 'UnsupportedCommandError'
    }
}

class InsufficientPermissionsError extends Error {
    constructor(message) {
        super()
        this.message = message
        this.code = 404
        this.type = 'InsufficientPermissionsError'
    }
}


function ErrorHandler(err) {
    let response;
    let errMessage = typeof err === 'string' ? err : err.message;
    if (err.type === 'InvalidCORS') {
        response = responseModel.badRequest("Bad Request", null, errMessage);
    } else if (err.type === 'UnsupportedCommandError') {
        response = responseModel.badRequest("Create failed", null, errMessage);
    } else if (err.type === 'InsufficientPermissionsError') {
        response = responseModel.notFound("Not Found", null, errMessage);
    } else {
        response = responseModel.failResponse("Failed response", null, errMessage);
    }

    return response;
}

module.exports = {
    BadRequest,
    UnsupportedCommandError,
    InsufficientPermissionsError,
    ErrorHandler
};