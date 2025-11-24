const logger = require('../utils/logger');
const config = require('../config');

/**
 * Middleware de manejo de errores centralizado
 */
const errorMiddleware = (err, req, res, next) => {
    // Log del error
    logger.error('Error capturado:', {
        message: err.message,
        stack: config.env === 'development' ? err.stack : undefined,
        url: req.url,
        method: req.method,
    });

    // Determinar código de estado
    let statusCode = err.statusCode || 500;

    // Si el status es 200 pero hay un error, usar 500
    if (res.statusCode === 200) {
        statusCode = 500;
    }

    // Preparar respuesta de error
    const errorResponse = {
        success: false,
        message: err.message || 'Error interno del servidor',
        timestamp: new Date().toISOString(),
    };

    // En desarrollo, incluir más detalles
    if (config.env === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.error = err;
    }

    // Tipos específicos de errores
    if (err.name === 'ValidationError') {
        errorResponse.errors = err.errors;
        statusCode = 400;
    }

    if (err.name === 'JsonWebTokenError') {
        errorResponse.message = 'Token inválido';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        errorResponse.message = 'Token expirado';
        statusCode = 401;
    }

    // Errores de Mongoose (si usas MongoDB)
    if (err.name === 'CastError') {
        errorResponse.message = 'Formato de ID inválido';
        statusCode = 400;
    }

    if (err.code === 11000) {
        errorResponse.message = 'Recurso duplicado';
        statusCode = 409;
    }

    // Enviar respuesta
    res.status(statusCode).json(errorResponse);
};

module.exports = errorMiddleware;
