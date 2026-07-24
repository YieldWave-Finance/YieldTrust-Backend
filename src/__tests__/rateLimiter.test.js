const express = require('express');
const request = require('supertest');
const { rateLimit, resetStore } = require('../middleware/rateLimiter');

function buildApp(opts) {
  const app = express();
  app.use(rateLimit(opts));
  app.get('/', (req, res) => res.json({ ok: true }));
  return app;
}

beforeEach(() => {
  resetStore();
});

describe('rateLimit middleware', () => {
  it('allows requests under the limit', async () => {
    const app = buildApp({ windowMs: 60000, max: 5 });
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('blocks requests over the limit with 429', async () => {
    const app = buildApp({ windowMs: 60000, max: 2 });
    await request(app).get('/');
    await request(app).get('/');
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Too many requests, please try again later');
  });

  it('sets rate limit headers', async () => {
    const app = buildApp({ windowMs: 60000, max: 10 });
    const res = await request(app).get('/');
    expect(res.headers['x-ratelimit-limit']).toBe('10');
    expect(res.headers['x-ratelimit-remaining']).toBe('9');
    expect(res.headers['x-ratelimit-reset']).toBeDefined();
  });

  it('resets after the window expires', async () => {
    const app = buildApp({ windowMs: 50, max: 1 });
    await request(app).get('/');
    const blocked = await request(app).get('/');
    expect(blocked.statusCode).toBe(429);
    await new Promise((r) => setTimeout(r, 60));
    const allowed = await request(app).get('/');
    expect(allowed.statusCode).toBe(200);
  });

  it('uses custom error message', async () => {
    const app = buildApp({ windowMs: 60000, max: 1, message: 'Custom limit reached' });
    await request(app).get('/');
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('Custom limit reached');
  });

  it('uses default config from env vars', async () => {
    const app = buildApp();
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(Number(res.headers['x-ratelimit-limit'])).toBeGreaterThan(0);
  });
});
