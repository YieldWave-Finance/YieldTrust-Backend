const express = require('express');
const request = require('supertest');
const errorHandler = require('../middleware/errorHandler');

function buildApp() {
  const app = express();
  app.get('/boom', (req, res, next) => next(new Error('Database unavailable')));
  app.use(errorHandler);
  return app;
}

describe('errorHandler logging', () => {
  let errorSpy;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('logs request error context as structured JSON', async () => {
    const res = await request(buildApp()).get('/boom');

    expect(res.statusCode).toBe(500);
    expect(errorSpy).toHaveBeenCalledTimes(1);

    const payload = JSON.parse(errorSpy.mock.calls[0][0]);
    expect(payload).toMatchObject({
      level: 'error',
      message: 'Request failed',
      status: 500,
      method: 'GET',
      path: '/boom',
      error: {
        name: 'Error',
        message: 'Database unavailable',
      },
    });
    expect(payload.timestamp).toBeDefined();
  });
});
