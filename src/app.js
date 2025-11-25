const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors(config.cors));

// Middlewares de parsing
app.use(express.json({ limit: config.requestLimits.maxRequestSize }));
app.use(express.urlencoded({ extended: true, limit: config.requestLimits.maxRequestSize }));

// Logging
if (config.env !== 'test') {
    app.use(morgan(config.logging.format, {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }));
}

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Estadísticas de Matrices QR',
        version: '1.0.0',
        documentation: '/api/docs',
        endpoints: {
            health: 'GET /health',
            statistics: 'POST /api/statistics'
        }
    });
});

// Rutas de la API
app.use('/api/v1', routes);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        message: `La ruta ${req.method} ${req.path} no existe`,
        timestamp: new Date().toISOString()
    });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

module.exports = app;
