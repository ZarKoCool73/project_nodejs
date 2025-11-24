require('dotenv').config();

const config = {
    // Configuración del servidor
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',

    // Configuración de CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    },

    // Configuración de la API de Go
    goApiUrl: process.env.GO_API_URL || 'http://localhost:3000',

    // Configuración de JWT (opcional)
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },

    // Límites de request
    requestLimits: {
        maxMatrixSize: parseInt(process.env.MAX_MATRIX_SIZE) || 1000,
        maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
    },

    // Configuración de logs
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined',
    },
};

// Validar configuraciones críticas en producción
if (config.env === 'production') {
    const requiredEnvVars = ['JWT_SECRET'];
    const missing = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
    }
}

module.exports = config;
