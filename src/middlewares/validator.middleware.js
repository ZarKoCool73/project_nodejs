const MatrixService = require('../services/matrix.service');
const ResponseUtil = require('../utils/response');
const config = require('../config');
const logger = require('../utils/logger');

class ValidatorMiddleware {
    /**
     * Valida el request de estadísticas
     */
    static validateStatisticsRequest(req, res, next) {
        try {
            const { matrixQ, matrixR } = req.body;

            // Validar que existan ambas matrices
            if (!matrixQ || !matrixR) {
                logger.warn('Request sin matrices Q o R');
                return ResponseUtil.validationError(res, {
                    matrixQ: !matrixQ ? 'La matriz Q es requerida' : undefined,
                    matrixR: !matrixR ? 'La matriz R es requerida' : undefined,
                });
            }

            // Validar formato de matriz Q
            const qValidation = MatrixService.validateMatrix(matrixQ);
            if (!qValidation.valid) {
                logger.warn('Matriz Q inválida:', qValidation.error);
                return ResponseUtil.validationError(res, {
                    matrixQ: qValidation.error,
                });
            }

            // Validar formato de matriz R
            const rValidation = MatrixService.validateMatrix(matrixR);
            if (!rValidation.valid) {
                logger.warn('Matriz R inválida:', rValidation.error);
                return ResponseUtil.validationError(res, {
                    matrixR: rValidation.error,
                });
            }

            // Validar tamaño de las matrices
            const maxSize = config.requestLimits.maxMatrixSize;
            if (matrixQ.length > maxSize || matrixR.length > maxSize) {
                logger.warn('Matrices exceden el tamaño máximo permitido');
                return ResponseUtil.validationError(res, {
                    size: `Las matrices no pueden exceder ${maxSize}x${maxSize}`,
                });
            }

            // Validar dimensiones compatibles para factorización QR
            const qRows = matrixQ.length;
            const qCols = matrixQ[0].length;
            const rRows = matrixR.length;
            const rCols = matrixR[0].length;

            if (qCols !== rRows) {
                logger.warn('Dimensiones incompatibles de matrices Q y R');
                return ResponseUtil.validationError(res, {
                    dimensions: `Las dimensiones de Q (${qRows}x${qCols}) y R (${rRows}x${rCols}) no son compatibles para factorización QR`,
                });
            }

            logger.debug('Validación exitosa de request de estadísticas');
            next();
        } catch (error) {
            logger.error('Error en validación:', { error: error.message });
            return ResponseUtil.error(res, 'Error en la validación de datos', 500);
        }
    }

    /**
     * Valida parámetros de query generales
     */
    static validateQueryParams(allowedParams) {
        return (req, res, next) => {
            const queryKeys = Object.keys(req.query);
            const invalidParams = queryKeys.filter(key => !allowedParams.includes(key));

            if (invalidParams.length > 0) {
                logger.warn('Parámetros de query inválidos:', invalidParams);
                return ResponseUtil.validationError(res, {
                    invalidParams: `Parámetros no permitidos: ${invalidParams.join(', ')}`,
                });
            }

            next();
        };
    }

    /**
     * Valida Content-Type
     */
    static validateContentType(req, res, next) {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const contentType = req.headers['content-type'];

            if (!contentType || !contentType.includes('application/json')) {
                logger.warn('Content-Type inválido:', contentType);
                return ResponseUtil.validationError(res, {
                    contentType: 'Content-Type debe ser application/json',
                });
            }
        }

        next();
    }
}

module.exports = ValidatorMiddleware;
