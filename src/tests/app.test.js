import request from 'supertest';
import app from '../app.js';

describe('API Endpoints', () => {
  test('GET /health should return server health', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });

  test('GET /api should return API status message', async () => {
    const res = await request(app).get('/api');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      'message',
      'ACQUISITIONS-JSM API is running!'
    );
  });

  test('GET unknown route should return 404', async () => {
    const res = await request(app).get('/wrong-route');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Route not found');
  });
});
