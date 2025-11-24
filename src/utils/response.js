class ResponseUtil {
    /**
     * Respuesta exitosa
     */
    static success(res, data, message = 'Operación exitosa', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Respuesta de error
     */
    static error(res, message = 'Error en la operación', statusCode = 500, errors = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Respuesta de validación
     */
    static validationError(res, errors) {
        return this.error(res, 'Error de validación', 400, errors);
    }

    /**
     * Respuesta no encontrado
     */
    static notFound(res, message = 'Recurso no encontrado') {
        return this.error(res, message, 404);
    }

    /**
     * Respuesta no autorizado
     */
    static unauthorized(res, message = 'No autorizado') {
        return this.error(res, message, 401);
    }

    /**
     * Respuesta prohibido
     */
    static forbidden(res, message = 'Acceso prohibido') {
        return this.error(res, message, 403);
    }
}

module.exports = ResponseUtil;
