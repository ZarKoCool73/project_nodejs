const StatisticsService = require('../services/statistics.service');
const ResponseUtil = require('../utils/response');
const logger = require('../utils/logger');

class StatisticsController {
    /**
     * Calcula estadísticas de las matrices Q y R
     * @route POST /api/statistics
     */
    static async calculateStatistics(req, res, next) {
        try {
            const { matrixQ, matrixR } = req.body;

            logger.info('Procesando solicitud de estadísticas', {
                qDimensions: `${matrixQ.length}x${matrixQ[0]?.length}`,
                rDimensions: `${matrixR.length}x${matrixR[0]?.length}`,
            });

            // Generar reporte completo
            const report = StatisticsService.generateFullReport(matrixQ, matrixR);

            logger.info('Estadísticas calculadas exitosamente');

            return ResponseUtil.success(
                res,
                report,
                'Estadísticas calculadas correctamente',
                200
            );
        } catch (error) {
            logger.error('Error en calculateStatistics:', { error: error.message });
            next(error);
        }
    }

    /**
     * Obtiene solo estadísticas básicas
     * @route POST /api/statistics/basic
     */
    static async getBasicStatistics(req, res, next) {
        try {
            const { matrixQ, matrixR } = req.body;

            logger.info('Procesando solicitud de estadísticas básicas');

            const statistics = StatisticsService.calculateStatistics(matrixQ, matrixR);

            return ResponseUtil.success(
                res,
                { statistics: statistics.basic },
                'Estadísticas básicas calculadas',
                200
            );
        } catch (error) {
            logger.error('Error en getBasicStatistics:', { error: error.message });
            next(error);
        }
    }

    /**
     * Obtiene análisis de matrices
     * @route POST /api/statistics/analysis
     */
    static async getMatrixAnalysis(req, res, next) {
        try {
            const { matrixQ, matrixR } = req.body;

            logger.info('Procesando análisis de matrices');

            const analysis = StatisticsService.analyzeMatrices(matrixQ, matrixR);

            return ResponseUtil.success(
                res,
                analysis,
                'Análisis de matrices completado',
                200
            );
        } catch (error) {
            logger.error('Error en getMatrixAnalysis:', { error: error.message });
            next(error);
        }
    }

    /**
     * Health check del servicio de estadísticas
     * @route GET /api/statistics/health
     */
    static async healthCheck(req, res) {
        return ResponseUtil.success(
            res,
            {
                service: 'Statistics Service',
                status: 'operational',
                uptime: process.uptime(),
            },
            'Servicio operativo',
            200
        );
    }
}

module.exports = StatisticsController;
