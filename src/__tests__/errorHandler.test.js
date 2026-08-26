const express = require('express');
const request = require('supertest');
const errorHandler = require('../middleware/errorHandler');

function buildApp(errorFactory) {
  const app = express();
  app.get('/boom', (req, res, next) => next(errorFactory()));
  app.use(errorHandler);
  return app;
}

describe('errorHandler middleware', () => {
  it('returns standardized details for known request errors', async () => {
    const app = buildApp(() => {
      const err = new Error('Invalid escrow id');
      err.status = 400;
      err.code = 'VALIDATION_ERROR';
      err.details = { field: 'id' };
      return err;
    });

    const res = await request(app).get('/boom');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: {
        message: 'Invalid escrow id',
        code: 'VALIDATION_ERROR',
        details: { field: 'id' },
      },
    });
  });

  it('uses a stable internal error code by default', async () => {
    const app = buildApp(() => new Error('Database unavailable'));

    const res = await request(app).get('/boom');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: {
        message: 'Database unavailable',
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  });
});
