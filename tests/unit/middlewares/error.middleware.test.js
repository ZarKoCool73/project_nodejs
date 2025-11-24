// tests/errorMiddleware.test.js
const errorMiddleware = require('../../../src/middlewares/error.middleware');
const logger = require('../../../src/utils/logger');
const config = require('../../../src/config/index');

// Mock del logger para no imprimir en consola durante tests
jest.mock('../../../src/utils/logger', () => ({
    error: jest.fn(),
}));

describe('errorMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { url: '/test', method: 'GET' };
        res = {
            statusCode: 200,
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('Debe manejar un error genérico y retornar status 500', () => {
        const err = new Error('Error genérico');

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: 'Error genérico',
        }));
        expect(logger.error).toHaveBeenCalled();
    });

    it('Debe incluir stack trace en desarrollo', () => {
        config.env = 'development';
        const err = new Error('Error con stack');

        errorMiddleware(err, req, res, next);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            stack: err.stack,
            error: err,
        }));
    });

    it('Debe manejar ValidationError y retornar 400', () => {
        const err = new Error('Error de validación');
        err.name = 'ValidationError';
        err.errors = { field: 'Required' };

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            errors: { field: 'Required' },
        }));
    });

    it('Debe manejar JsonWebTokenError y retornar 401', () => {
        const err = new Error('Token inválido');
        err.name = 'JsonWebTokenError';

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Token inválido',
        }));
    });

    it('Debe manejar TokenExpiredError y retornar 401', () => {
        const err = new Error('Token expirado');
        err.name = 'TokenExpiredError';

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Token expirado',
        }));
    });

    it('Debe manejar CastError y retornar 400', () => {
        const err = new Error('ID inválido');
        err.name = 'CastError';

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Formato de ID inválido',
        }));
    });

    it('Debe manejar errores de duplicado (code 11000) y retornar 409', () => {
        const err = new Error('Duplicado');
        err.code = 11000;

        errorMiddleware(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Recurso duplicado',
        }));
    });
});
