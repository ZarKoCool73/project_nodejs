// tests/validatorMiddleware.test.js
const ValidatorMiddleware = require('../../../src/middlewares/validator.middleware');
const MatrixService = require('../../../src/services/matrix.service');
const ResponseUtil = require('../../../src/utils/response');
const logger = require('../../../src/utils/logger');
const config = require('../../../src/config/index');

// Mocks
jest.mock('../../../src/services/matrix.service');
jest.mock('../../../src/utils/response');
jest.mock('../../../src/utils/logger');

describe('ValidatorMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                matrixQ: [[1, 2], [3, 4]],
                matrixR: [[5, 6], [7, 8]]
            },
            query: {},
            headers: {},
            method: 'POST'
        };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        jest.clearAllMocks();
        config.requestLimits = { maxMatrixSize: 10 };
    });

    describe('validateStatisticsRequest', () => {
        it('Debe llamar a next si matrices válidas y compatibles', () => {
            MatrixService.validateMatrix.mockReturnValue({ valid: true });

            ValidatorMiddleware.validateStatisticsRequest(req, res, next);

            expect(MatrixService.validateMatrix).toHaveBeenCalledTimes(2);
            expect(next).toHaveBeenCalled();
        });

        it('Debe retornar error si falta matrixQ o matrixR', () => {
            req.body.matrixQ = null;

            ValidatorMiddleware.validateStatisticsRequest(req, res, next);

            expect(ResponseUtil.validationError).toHaveBeenCalledWith(res, expect.objectContaining({
                matrixQ: 'La matriz Q es requerida'
            }));
            expect(logger.warn).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });

        it('Debe retornar error si matriz Q inválida', () => {
            MatrixService.validateMatrix.mockReturnValueOnce({ valid: false, error: 'error Q' });

            ValidatorMiddleware.validateStatisticsRequest(req, res, next);

            expect(ResponseUtil.validationError).toHaveBeenCalledWith(res, { matrixQ: 'error Q' });
            expect(logger.warn).toHaveBeenCalledWith('Matriz Q inválida:', 'error Q');
        });

        it('Debe retornar error si matriz R inválida', () => {
            MatrixService.validateMatrix.mockReturnValueOnce({ valid: true }).mockReturnValueOnce({ valid: false, error: 'error R' });

            ValidatorMiddleware.validateStatisticsRequest(req, res, next);

            expect(ResponseUtil.validationError).toHaveBeenCalledWith(res, { matrixR: 'error R' });
            expect(logger.warn).toHaveBeenCalledWith('Matriz R inválida:', 'error R');
        });

        it('Debe retornar error si matrices exceden tamaño máximo', () => {
            req.body.matrixQ = new Array(11).fill([1, 2]);
            req.body.matrixR = new Array(11).fill([3, 4]);
            MatrixService.validateMatrix.mockReturnValue({ valid: true });

            ValidatorMiddleware.validateStatisticsRequest(req, res, next);

            expect(ResponseUtil.validationError).toHaveBeenCalledWith(res, expect.objectContaining({
                size: 'Las matrices no pueden exceder 10x10'
            }));
            expect(logger.warn).toHaveBeenCalledWith('Matrices exceden el tamaño máximo permitido');
        });

        it('Debe retornar error si dimensiones incompatibles', () => {
            req.body.matrixR = [[1, 2, 3]]; // 1x3
            MatrixService.validateMatrix.mockReturnValue({ valid: true });

            ValidatorMiddleware.validateStatisticsRequest(req, res, next);

            expect(ResponseUtil.validationError).toHaveBeenCalledWith(res, expect.objectContaining({
                dimensions: expect.stringContaining('no son compatibles')
            }));
            expect(logger.warn).toHaveBeenCalledWith('Dimensiones incompatibles de matrices Q y R');
        });

        it('Debe capturar excepción y retornar error 500', () => {
            MatrixService.validateMatrix.mockImplementation(() => { throw new Error('falla') });

            ValidatorMiddleware.validateStatisticsRequest(req, res, next);

            expect(ResponseUtil.error).toHaveBeenCalledWith(res, 'Error en la validación de datos', 500);
            expect(logger.error).toHaveBeenCalledWith('Error en validación:', { error: 'falla' });
        });
    });

    describe('validateQueryParams', () => {
        it('Debe llamar a next si todos los params son válidos', () => {
            const middleware = ValidatorMiddleware.validateQueryParams(['a', 'b']);
            req.query = { a: 1 };

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('Debe retornar error si hay params inválidos', () => {
            const middleware = ValidatorMiddleware.validateQueryParams(['a']);
            req.query = { a: 1, b: 2 };

            middleware(req, res, next);

            expect(ResponseUtil.validationError).toHaveBeenCalledWith(res, expect.objectContaining({
                invalidParams: 'Parámetros no permitidos: b'
            }));
            expect(next).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('validateContentType', () => {
        it('Debe retornar error si Content-Type inválido', () => {
            req.headers['content-type'] = 'text/plain';

            ValidatorMiddleware.validateContentType(req, res, next);

            expect(ResponseUtil.validationError).toHaveBeenCalledWith(res, expect.objectContaining({
                contentType: 'Content-Type debe ser application/json'
            }));
            expect(next).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
        });

        it('Debe llamar a next si Content-Type válido', () => {
            req.headers['content-type'] = 'application/json';

            ValidatorMiddleware.validateContentType(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('Debe llamar a next si método no requiere Content-Type', () => {
            req.method = 'GET';

            ValidatorMiddleware.validateContentType(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
