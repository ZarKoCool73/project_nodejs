const express = require('express');
const StatisticsController = require('../controllers/statistics.controller');
const ValidatorMiddleware = require('../middlewares/validator.middleware');

const router = express.Router();

/**
 * @route   GET /api/statistics/health
 * @desc    Health check del servicio
 * @access  Public
 */
router.get('/health', StatisticsController.healthCheck);

/**
 * @route   POST /api/statistics
 * @desc    Calcula estadísticas completas de matrices Q y R
 * @access  Public
 */
router.post(
    '/',
    ValidatorMiddleware.validateContentType,
    ValidatorMiddleware.validateStatisticsRequest,
    StatisticsController.calculateStatistics
);

/**
 * @route   POST /api/statistics/basic
 * @desc    Calcula solo estadísticas básicas
 * @access  Public
 */
router.post(
    '/basic',
    ValidatorMiddleware.validateContentType,
    ValidatorMiddleware.validateStatisticsRequest,
    StatisticsController.getBasicStatistics
);

/**
 * @route   POST /api/statistics/analysis
 * @desc    Analiza propiedades de las matrices
 * @access  Public
 */
router.post(
    '/analysis',
    ValidatorMiddleware.validateContentType,
    ValidatorMiddleware.validateStatisticsRequest,
    StatisticsController.getMatrixAnalysis
);

module.exports = router;
