const app = require('./src/app');
const config = require('./src/config');
const logger = require('./src/utils/logger');

const server = app.listen(config.port, () => {
    logger.info(`🚀 Servidor corriendo en puerto ${config.port}`);
    logger.info(`📝 Ambiente: ${config.env}`);
    logger.info(`🔗 URL: http://localhost:${config.port}`);
});

// Manejo de señales de terminación
const gracefulShutdown = (signal) => {
    logger.info(`\n${signal} recibido. Cerrando servidor...`);
    server.close(() => {
        logger.info('Servidor cerrado correctamente');
        process.exit(0);
    });

    // Forzar cierre después de 10 segundos
    setTimeout(() => {
        logger.error('Forzando cierre del servidor');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    gracefulShutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

module.exports = server;
