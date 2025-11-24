const MatrixService = require('./matrix.service');
const logger = require('../utils/logger');

class StatisticsService {
    /**
     * Calcula las estadísticas de las matrices Q y R
     * @param {Array<Array<number>>} matrixQ
     * @param {Array<Array<number>>} matrixR
     * @returns {Object}
     */
    static calculateStatistics(matrixQ, matrixR) {
        try {
            logger.info('Calculando estadísticas de matrices QR');

            // Extraer todos los valores de ambas matrices
            const allValues = MatrixService.extractAllValues(matrixQ, matrixR);

            if (allValues.length === 0) {
                throw new Error('No se encontraron valores válidos en las matrices');
            }

            // Calcular estadísticas básicas
            const statistics = {
                max: this.calculateMax(allValues),
                min: this.calculateMin(allValues),
                sum: this.calculateSum(allValues),
                average: this.calculateAverage(allValues),
                count: allValues.length,
            };

            // Calcular estadísticas adicionales
            const additionalStats = {
                median: this.calculateMedian(allValues),
                variance: this.calculateVariance(allValues, statistics.average),
                standardDeviation: this.calculateStandardDeviation(allValues, statistics.average),
            };

            logger.info('Estadísticas calculadas exitosamente');

            return {
                basic: statistics,
                advanced: additionalStats,
            };
        } catch (error) {
            logger.error('Error calculando estadísticas:', { error: error.message });
            throw error;
        }
    }

    /**
     * Calcula el valor máximo
     * @param {Array<number>} values
     * @returns {number}
     */
    static calculateMax(values) {
        return Math.max(...values);
    }

    /**
     * Calcula el valor mínimo
     * @param {Array<number>} values
     * @returns {number}
     */
    static calculateMin(values) {
        return Math.min(...values);
    }

    /**
     * Calcula la suma total
     * @param {Array<number>} values
     * @returns {number}
     */
    static calculateSum(values) {
        return values.reduce((acc, val) => acc + val, 0);
    }

    /**
     * Calcula el promedio
     * @param {Array<number>} values
     * @returns {number}
     */
    static calculateAverage(values) {
        if (values.length === 0) return 0;
        return this.calculateSum(values) / values.length;
    }

    /**
     * Calcula la mediana
     * @param {Array<number>} values
     * @returns {number}
     */
    static calculateMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        }
        return sorted[mid];
    }

    /**
     * Calcula la varianza
     * @param {Array<number>} values
     * @param {number} mean
     * @returns {number}
     */
    static calculateVariance(values, mean) {
        if (values.length === 0) return 0;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        return this.calculateSum(squaredDiffs) / values.length;
    }

    /**
     * Calcula la desviación estándar
     * @param {Array<number>} values
     * @param {number} mean
     * @returns {number}
     */
    static calculateStandardDeviation(values, mean) {
        return Math.sqrt(this.calculateVariance(values, mean));
    }

    /**
     * Analiza las propiedades de las matrices Q y R
     * @param {Array<Array<number>>} matrixQ
     * @param {Array<Array<number>>} matrixR
     * @returns {Object}
     */
    static analyzeMatrices(matrixQ, matrixR) {
        try {
            logger.info('Analizando propiedades de matrices');

            const analysis = {
                matrixQ: MatrixService.getMatrixInfo(matrixQ, 'Q'),
                matrixR: MatrixService.getMatrixInfo(matrixR, 'R'),
            };

            // Validaciones específicas de factorización QR
            analysis.validations = {
                qIsOrthogonal: this.checkOrthogonality(matrixQ),
                rIsUpperTriangular: MatrixService.isUpperTriangular(matrixR),
            };

            logger.info('Análisis de matrices completado');

            return analysis;
        } catch (error) {
            logger.error('Error analizando matrices:', { error: error.message });
            throw error;
        }
    }

    /**
     * Verifica si una matriz es aproximadamente ortogonal
     * (Q * Q^T ≈ I para una matriz Q ortogonal)
     * @param {Array<Array<number>>} matrix
     * @returns {boolean}
     */
    static checkOrthogonality(matrix) {
        try {
            if (!MatrixService.isSquare(matrix)) {
                return false;
            }

            const n = matrix.length;
            const epsilon = 1e-6;

            // Verificar Q * Q^T = I
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    let dotProduct = 0;
                    for (let k = 0; k < n; k++) {
                        dotProduct += matrix[i][k] * matrix[j][k];
                    }

                    const expected = i === j ? 1 : 0;
                    if (Math.abs(dotProduct - expected) > epsilon) {
                        return false;
                    }
                }
            }

            return true;
        } catch (error) {
            logger.error('Error verificando ortogonalidad:', { error: error.message });
            return false;
        }
    }

    /**
     * Genera un reporte completo de las matrices
     * @param {Array<Array<number>>} matrixQ
     * @param {Array<Array<number>>} matrixR
     * @returns {Object}
     */
    static generateFullReport(matrixQ, matrixR) {
        const statistics = this.calculateStatistics(matrixQ, matrixR);
        const analysis = this.analyzeMatrices(matrixQ, matrixR);

        return {
            statistics,
            matrixAnalysis: analysis,
            timestamp: new Date().toISOString(),
        };
    }
}

module.exports = StatisticsService;
