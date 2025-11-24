const request = require('supertest');
const app = require('../../src/app');

describe('Statistics API Integration Tests', () => {
    const validMatrices = {
        matrixQ: [[1, 0], [0, 1]],
        matrixR: [[2, 3], [0, 4]],
    };

    describe('GET /health', () => {
        test('debe retornar status OK', async () => {
            const response = await request(app).get('/health');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('OK');
            expect(response.body).toHaveProperty('timestamp');
        });
    });

    describe('GET /', () => {
        test('debe retornar información de la API', async () => {
            const response = await request(app).get('/');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('endpoints');
        });
    });

    describe('POST /api/statistics', () => {
        test('debe calcular estadísticas correctamente', async () => {
            const response = await request(app)
                .post('/api/statistics')
                .send(validMatrices)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('statistics');
            expect(response.body.data).toHaveProperty('matrixAnalysis');
            expect(response.body.data.statistics.basic).toHaveProperty('max');
            expect(response.body.data.statistics.basic).toHaveProperty('min');
            expect(response.body.data.statistics.basic).toHaveProperty('sum');
            expect(response.body.data.statistics.basic).toHaveProperty('average');
        });

        test('debe rechazar request sin matrices', async () => {
            const response = await request(app)
                .post('/api/statistics')
                .send({})
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test('debe rechazar matrices con formato inválido', async () => {
            const response = await request(app)
                .post('/api/statistics')
                .send({
                    matrixQ: 'not a matrix',
                    matrixR: [[1, 2]],
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test('debe rechazar matrices con dimensiones incompatibles', async () => {
            const response = await request(app)
                .post('/api/statistics')
                .send({
                    matrixQ: [[1, 2, 3], [4, 5, 6]],
                    matrixR: [[1, 2], [3, 4]],
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test('debe detectar matriz diagonal correctamente', async () => {
            const response = await request(app)
                .post('/api/statistics')
                .send({
                    matrixQ: [[1, 0, 0], [0, 2, 0], [0, 0, 3]],
                    matrixR: [[4, 5, 6], [0, 7, 8], [0, 0, 9]],
                })
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.data.matrixAnalysis.matrixQ.isDiagonal).toBe(true);
        });
    });

    describe('POST /api/statistics/basic', () => {
        test('debe retornar solo estadísticas básicas', async () => {
            const response = await request(app)
                .post('/api/statistics/basic')
                .send(validMatrices)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('statistics');
            expect(response.body.data.statistics).toHaveProperty('max');
            expect(response.body.data.statistics).toHaveProperty('min');
        });
    });

    describe('POST /api/statistics/analysis', () => {
        test('debe retornar análisis de matrices', async () => {
            const response = await request(app)
                .post('/api/statistics/analysis')
                .send(validMatrices)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('matrixQ');
            expect(response.body.data).toHaveProperty('matrixR');
            expect(response.body.data).toHaveProperty('validations');
        });
    });

    describe('404 Handler', () => {
        test('debe manejar rutas no existentes', async () => {
            const response = await request(app).get('/api/nonexistent');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });
});
