const StatisticsService = require('../../../src/services/statistics.service');

describe('StatisticsService', () => {
    const matrixQ = [[1, 0], [0, 1]];
    const matrixR = [[2, 3], [0, 4]];

    describe('calculateMax', () => {
        test('debe calcular el valor máximo correctamente', () => {
            const values = [1, 5, 3, 9, 2];
            expect(StatisticsService.calculateMax(values)).toBe(9);
        });
    });

    describe('calculateMin', () => {
        test('debe calcular el valor mínimo correctamente', () => {
            const values = [1, 5, 3, 9, 2];
            expect(StatisticsService.calculateMin(values)).toBe(1);
        });
    });

    describe('calculateSum', () => {
        test('debe calcular la suma correctamente', () => {
            const values = [1, 2, 3, 4, 5];
            expect(StatisticsService.calculateSum(values)).toBe(15);
        });
    });

    describe('calculateAverage', () => {
        test('debe calcular el promedio correctamente', () => {
            const values = [2, 4, 6, 8, 10];
            expect(StatisticsService.calculateAverage(values)).toBe(6);
        });

        test('debe retornar 0 para array vacío', () => {
            expect(StatisticsService.calculateAverage([])).toBe(0);
        });
    });

    describe('calculateMedian', () => {
        test('debe calcular la mediana para cantidad impar de valores', () => {
            const values = [1, 3, 5, 7, 9];
            expect(StatisticsService.calculateMedian(values)).toBe(5);
        });

        test('debe calcular la mediana para cantidad par de valores', () => {
            const values = [1, 2, 3, 4];
            expect(StatisticsService.calculateMedian(values)).toBe(2.5);
        });
    });

    describe('calculateVariance', () => {
        test('debe calcular la varianza correctamente', () => {
            const values = [2, 4, 6, 8];
            const mean = 5;
            const variance = StatisticsService.calculateVariance(values, mean);
            expect(variance).toBe(5);
        });
    });

    describe('calculateStatistics', () => {
        test('debe calcular todas las estadísticas correctamente', () => {
            const result = StatisticsService.calculateStatistics(matrixQ, matrixR);

            expect(result).toHaveProperty('basic');
            expect(result).toHaveProperty('advanced');
            expect(result.basic).toHaveProperty('max');
            expect(result.basic).toHaveProperty('min');
            expect(result.basic).toHaveProperty('sum');
            expect(result.basic).toHaveProperty('average');
            expect(result.advanced).toHaveProperty('median');
            expect(result.advanced).toHaveProperty('variance');
        });

        test('debe lanzar error con matrices vacías', () => {
            expect(() => {
                StatisticsService.calculateStatistics([], []);
            }).toThrow();
        });
    });

    describe('analyzeMatrices', () => {
        test('debe analizar las propiedades de las matrices', () => {
            const analysis = StatisticsService.analyzeMatrices(matrixQ, matrixR);

            expect(analysis).toHaveProperty('matrixQ');
            expect(analysis).toHaveProperty('matrixR');
            expect(analysis).toHaveProperty('validations');
            expect(analysis.matrixQ).toHaveProperty('isDiagonal');
            expect(analysis.matrixR).toHaveProperty('dimensions');
        });
    });

    describe('generateFullReport', () => {
        test('debe generar un reporte completo', () => {
            const report = StatisticsService.generateFullReport(matrixQ, matrixR);

            expect(report).toHaveProperty('statistics');
            expect(report).toHaveProperty('matrixAnalysis');
            expect(report).toHaveProperty('timestamp');
        });
    });
});
