const express = require('express');
const statisticsRoutes = require('./statistics.routes');

const router = express.Router();

// Ruta principal de la API
router.get('/', (req, res) => {
    res.json({
        message: 'API de Estadísticas de Matrices QR',
        version: '1.0.0',
        endpoints: {
            statistics: '/api/statistics',
            basicStatistics: '/api/statistics/basic',
            matrixAnalysis: '/api/statistics/analysis',
            health: '/api/statistics/health',
        },
    });
});

// Montar rutas de estadísticas
router.use('/statistics', statisticsRoutes);

module.exports = router;
