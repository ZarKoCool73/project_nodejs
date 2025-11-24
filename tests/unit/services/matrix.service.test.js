const MatrixService = require('../../../src/services/matrix.service');

describe('MatrixService', () => {
    describe('isDiagonal', () => {
        test('debe identificar una matriz diagonal correctamente', () => {
            const diagonalMatrix = [
                [1, 0, 0],
                [0, 2, 0],
                [0, 0, 3],
            ];
            expect(MatrixService.isDiagonal(diagonalMatrix)).toBe(true);
        });

        test('debe retornar false para matriz no diagonal', () => {
            const nonDiagonalMatrix = [
                [1, 2, 0],
                [0, 2, 0],
                [0, 0, 3],
            ];
            expect(MatrixService.isDiagonal(nonDiagonalMatrix)).toBe(false);
        });

        test('debe retornar false para matriz rectangular', () => {
            const rectangularMatrix = [
                [1, 0],
                [0, 2],
                [0, 0],
            ];
            expect(MatrixService.isDiagonal(rectangularMatrix)).toBe(false);
        });

        test('debe retornar false para matriz vacía', () => {
            expect(MatrixService.isDiagonal([])).toBe(false);
        });
    });

    describe('getDimensions', () => {
        test('debe retornar dimensiones correctas', () => {
            const matrix = [[1, 2, 3], [4, 5, 6]];
            expect(MatrixService.getDimensions(matrix)).toBe('2x3');
        });

        test('debe retornar 0x0 para matriz vacía', () => {
            expect(MatrixService.getDimensions([])).toBe('0x0');
        });
    });

    describe('isSquare', () => {
        test('debe identificar matriz cuadrada', () => {
            const squareMatrix = [[1, 2], [3, 4]];
            expect(MatrixService.isSquare(squareMatrix)).toBe(true);
        });

        test('debe retornar false para matriz rectangular', () => {
            const rectangularMatrix = [[1, 2, 3], [4, 5, 6]];
            expect(MatrixService.isSquare(rectangularMatrix)).toBe(false);
        });
    });

    describe('isUpperTriangular', () => {
        test('debe identificar matriz triangular superior', () => {
            const upperTriangular = [
                [1, 2, 3],
                [0, 4, 5],
                [0, 0, 6],
            ];
            expect(MatrixService.isUpperTriangular(upperTriangular)).toBe(true);
        });

        test('debe retornar false para matriz no triangular superior', () => {
            const nonUpperTriangular = [
                [1, 2, 3],
                [1, 4, 5],
                [0, 0, 6],
            ];
            expect(MatrixService.isUpperTriangular(nonUpperTriangular)).toBe(false);
        });
    });

    describe('extractAllValues', () => {
        test('debe extraer todos los valores de múltiples matrices', () => {
            const matrix1 = [[1, 2], [3, 4]];
            const matrix2 = [[5, 6], [7, 8]];
            const values = MatrixService.extractAllValues(matrix1, matrix2);
            expect(values).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

        test('debe manejar matrices vacías', () => {
            const values = MatrixService.extractAllValues([], []);
            expect(values).toEqual([]);
        });
    });

    describe('validateMatrix', () => {
        test('debe validar matriz correcta', () => {
            const matrix = [[1, 2], [3, 4]];
            const result = MatrixService.validateMatrix(matrix);
            expect(result.valid).toBe(true);
        });

        test('debe rechazar matriz null', () => {
            const result = MatrixService.validateMatrix(null);
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
        });

        test('debe rechazar matriz con filas de diferente longitud', () => {
            const matrix = [[1, 2], [3, 4, 5]];
            const result = MatrixService.validateMatrix(matrix);
            expect(result.valid).toBe(false);
        });

        test('debe rechazar matriz con valores no numéricos', () => {
            const matrix = [[1, 'a'], [3, 4]];
            const result = MatrixService.validateMatrix(matrix);
            expect(result.valid).toBe(false);
        });
    });
});
