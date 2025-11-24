// tests/statisticsController.test.js
const StatisticsController = require('../../../src/controllers/statistics.controller');
const StatisticsService = require('../../../src/services/statistics.service');
const ResponseUtil = require('../../../src/utils/response');
const logger = require('../../../src/utils/logger');

// Mocks
jest.mock('../../../src/services/statistics.service');
jest.mock('../../../src/utils/response');
jest.mock('../../../src/utils/logger');

describe('StatisticsController', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: { matrixQ: [[1, 2], [3, 4]], matrixR: [[5, 6], [7, 8]] } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();

        jest.clearAllMocks();
    });

    describe('calculateStatistics', () => {
        it('Debe calcular estadísticas y retornar respuesta exitosa', async () => {
            const mockReport = { summary: 'report' };
            StatisticsService.generateFullReport.mockReturnValue(mockReport);
            ResponseUtil.success.mockReturnValue('success');

            const result = await StatisticsController.calculateStatistics(req, res, next);

            expect(StatisticsService.generateFullReport).toHaveBeenCalledWith(req.body.matrixQ, req.body.matrixR);
            expect(ResponseUtil.success).toHaveBeenCalledWith(res, mockReport, 'Estadísticas calculadas correctamente', 200);
            expect(result).toBe('success');
            expect(logger.info).toHaveBeenCalledTimes(2);
        });

        it('Debe llamar a next en caso de error', async () => {
            const error = new Error('fallo');
            StatisticsService.generateFullReport.mockImplementation(() => { throw error; });

            await StatisticsController.calculateStatistics(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(logger.error).toHaveBeenCalledWith('Error en calculateStatistics:', { error: error.message });
        });
    });

    describe('getBasicStatistics', () => {
        it('Debe retornar estadísticas básicas correctamente', async () => {
            const mockStats = { basic: { mean: 5 } };
            StatisticsService.calculateStatistics.mockReturnValue(mockStats);
            ResponseUtil.success.mockReturnValue('success');

            const result = await StatisticsController.getBasicStatistics(req, res, next);

            expect(StatisticsService.calculateStatistics).toHaveBeenCalledWith(req.body.matrixQ, req.body.matrixR);
            expect(ResponseUtil.success).toHaveBeenCalledWith(res, { statistics: mockStats.basic }, 'Estadísticas básicas calculadas', 200);
            expect(result).toBe('success');
        });

        it('Debe llamar a next en caso de error', async () => {
            const error = new Error('error básico');
            StatisticsService.calculateStatistics.mockImplementation(() => { throw error; });

            await StatisticsController.getBasicStatistics(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(logger.error).toHaveBeenCalledWith('Error en getBasicStatistics:', { error: error.message });
        });
    });

    describe('getMatrixAnalysis', () => {
        it('Debe retornar análisis de matrices correctamente', async () => {
            const mockAnalysis = { analysis: 'data' };
            StatisticsService.analyzeMatrices.mockReturnValue(mockAnalysis);
            ResponseUtil.success.mockReturnValue('success');

            const result = await StatisticsController.getMatrixAnalysis(req, res, next);

            expect(StatisticsService.analyzeMatrices).toHaveBeenCalledWith(req.body.matrixQ, req.body.matrixR);
            expect(ResponseUtil.success).toHaveBeenCalledWith(res, mockAnalysis, 'Análisis de matrices completado', 200);
            expect(result).toBe('success');
        });

        it('Debe llamar a next en caso de error', async () => {
            const error = new Error('error análisis');
            StatisticsService.analyzeMatrices.mockImplementation(() => { throw error; });

            await StatisticsController.getMatrixAnalysis(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(logger.error).toHaveBeenCalledWith('Error en getMatrixAnalysis:', { error: error.message });
        });
    });

    describe('healthCheck', () => {
        it('Debe retornar estado del servicio', async () => {
            ResponseUtil.success.mockReturnValue('success');

            const result = await StatisticsController.healthCheck(req, res);

            expect(ResponseUtil.success).toHaveBeenCalledWith(
                res,
                expect.objectContaining({ service: 'Statistics Service', status: 'operational' }),
                'Servicio operativo',
                200
            );
            expect(result).toBe('success');
        });
    });
});
