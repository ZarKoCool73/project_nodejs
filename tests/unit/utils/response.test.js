// tests/responseUtil.test.js
const ResponseUtil = require('../../../src/utils/response');

describe('ResponseUtil', () => {
    let res;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('success', () => {
        it('Debe retornar respuesta exitosa con valores por defecto', () => {
            const data = { key: 'value' };

            ResponseUtil.success(res, data);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Operación exitosa',
                data
            }));
            expect(res.json.mock.calls[0][0].timestamp).toBeDefined();
        });

        it('Debe permitir personalizar mensaje y statusCode', () => {
            const data = {};
            ResponseUtil.success(res, data, 'Mensaje personalizado', 201);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Mensaje personalizado',
                data
            }));
        });
    });

    describe('error', () => {
        it('Debe retornar error con valores por defecto', () => {
            ResponseUtil.error(res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Error en la operación'
            }));
        });

        it('Debe incluir errors si se proporcionan', () => {
            const errors = { field: 'requerido' };
            ResponseUtil.error(res, 'Mensaje', 400, errors);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Mensaje',
                errors
            }));
        });
    });

    describe('validationError', () => {
        it('Debe retornar error de validación con status 400', () => {
            const errors = { field: 'requerido' };
            ResponseUtil.validationError(res, errors);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Error de validación',
                errors
            }));
        });
    });

    describe('notFound', () => {
        it('Debe retornar error 404 con mensaje por defecto', () => {
            ResponseUtil.notFound(res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Recurso no encontrado'
            }));
        });

        it('Debe permitir mensaje personalizado', () => {
            ResponseUtil.notFound(res, 'No encontrado');

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'No encontrado'
            }));
        });
    });

    describe('unauthorized', () => {
        it('Debe retornar error 401 con mensaje por defecto', () => {
            ResponseUtil.unauthorized(res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'No autorizado'
            }));
        });
    });

    describe('forbidden', () => {
        it('Debe retornar error 403 con mensaje por defecto', () => {
            ResponseUtil.forbidden(res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Acceso prohibido'
            }));
        });
    });
});
