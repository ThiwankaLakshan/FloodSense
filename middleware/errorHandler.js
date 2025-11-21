const { error } = require('winston');
const logger = require('../config/logger');

//404 not found handler
function notFoundHandler(req, res, next) {
    const error = new Error(`Not found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}

//global error handler
function errorHandler(err, req, res, next) {
    logger.error('Request Error: ', {
        method: req.method,
        url: req.originalUrl,
        error: err.message,
        stack: err.stack,
        body: req.body
    });

    //determine status code
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
}

module.exports = {
    notFoundHandler,
    errorHandler
};