const logger = require('../utils/logger');

class MatrixService {
    /**
     * Verifica si una matriz es diagonal
     * @param {Array<Array<number>>} matrix - La matriz a verificar
     * @returns {boolean}
     */
    static isDiagonal(matrix) {
        try {
            if (!matrix || matrix.length === 0) {
                return false;
            }

            const rows = matrix.length;
            const cols = matrix[0]?.length || 0;

            // Una matriz diagonal debe ser cuadrada
            if (rows !== cols) {
                return false;
            }

            // Verificar que todos los elementos fuera de la diagonal sean 0
            // Usamos un umbral pequeño para manejar errores de punto flotante
            const epsilon = 1e-10;

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    if (i !== j && Math.abs(matrix[i][j]) > epsilon) {
                        return false;
                    }
                }
            }

            return true;
        } catch (error) {
            logger.error('Error verificando matriz diagonal:', { error: error.message });
            throw error;
        }
    }

    /**
     * Obtiene las dimensiones de una matriz
     * @param {Array<Array<number>>} matrix
     * @returns {string}
     */
    static getDimensions(matrix) {
        if (!matrix || matrix.length === 0) {
            return '0x0';
        }
        const rows = matrix.length;
        const cols = matrix[0]?.length || 0;
        return `${rows}x${cols}`;
    }

    /**
     * Verifica si una matriz es cuadrada
     * @param {Array<Array<number>>} matrix
     * @returns {boolean}
     */
    static isSquare(matrix) {
        if (!matrix || matrix.length === 0) {
            return false;
        }
        return matrix.length === (matrix[0]?.length || 0);
    }

    /**
     * Verifica si una matriz es triangular superior
     * @param {Array<Array<number>>} matrix
     * @returns {boolean}
     */
    static isUpperTriangular(matrix) {
        try {
            if (!this.isSquare(matrix)) {
                return false;
            }

            const n = matrix.length;
            const epsilon = 1e-10;

            for (let i = 1; i < n; i++) {
                for (let j = 0; j < i; j++) {
                    if (Math.abs(matrix[i][j]) > epsilon) {
                        return false;
                    }
                }
            }

            return true;
        } catch (error) {
            logger.error('Error verificando matriz triangular superior:', { error: error.message });
            return false;
        }
    }

    /**
     * Extrae todos los valores de una o más matrices
     * @param {...Array<Array<number>>} matrices
     * @returns {Array<number>}
     */
    static extractAllValues(...matrices) {
        const values = [];

        for (const matrix of matrices) {
            if (!matrix || !Array.isArray(matrix)) continue;

            for (const row of matrix) {
                if (!Array.isArray(row)) continue;

                for (const value of row) {
                    if (typeof value === 'number' && !isNaN(value)) {
                        values.push(value);
                    }
                }
            }
        }

        return values;
    }

    /**
     * Valida que la matriz tenga el formato correcto
     * @param {any} matrix
     * @returns {{ valid: boolean, error?: string }}
     */
    static validateMatrix(matrix) {
        if (!matrix) {
            return { valid: false, error: 'La matriz no puede ser null o undefined' };
        }

        if (!Array.isArray(matrix)) {
            return { valid: false, error: 'La matriz debe ser un array' };
        }

        if (matrix.length === 0) {
            return { valid: false, error: 'La matriz no puede estar vacía' };
        }

        // Verificar que todas las filas tengan la misma longitud
        const expectedCols = matrix[0]?.length;

        if (!expectedCols || expectedCols === 0) {
            return { valid: false, error: 'Las filas de la matriz no pueden estar vacías' };
        }

        for (let i = 0; i < matrix.length; i++) {
            if (!Array.isArray(matrix[i])) {
                return { valid: false, error: `La fila ${i} no es un array` };
            }

            if (matrix[i].length !== expectedCols) {
                return { valid: false, error: `Todas las filas deben tener la misma longitud` };
            }

            for (let j = 0; j < matrix[i].length; j++) {
                if (typeof matrix[i][j] !== 'number' || isNaN(matrix[i][j])) {
                    return { valid: false, error: `Valor inválido en posición [${i}][${j}]` };
                }
            }
        }

        return { valid: true };
    }

    /**
     * Obtiene información detallada de una matriz
     * @param {Array<Array<number>>} matrix
     * @param {string} name
     * @returns {Object}
     */
    static getMatrixInfo(matrix, name = 'Matrix') {
        return {
            name,
            dimensions: this.getDimensions(matrix),
            isSquare: this.isSquare(matrix),
            isDiagonal: this.isDiagonal(matrix),
            isUpperTriangular: this.isUpperTriangular(matrix)
        };
    }
}

module.exports = MatrixService;
