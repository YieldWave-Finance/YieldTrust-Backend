const express = require('express');
const request = require('supertest');

const {
  jsonBodyParser,
  sanitizeJsonBody,
  requireObjectBody,
  jsonErrorHandler,
  hasForbiddenKey
} = require('../middleware/jsonSecurity');

// Test-only app exercising the same hardening the real app mounts. These are
// NOT production endpoints; they exist to verify the reusable middleware.
function buildApp() {
  const app = express();
  app.use(jsonBodyParser, sanitizeJsonBody);
  app.post('/json', (req, res) => res.json({ ok: true, body: req.body }));
  app.post('/object', requireObjectBody, (req, res) => res.json({ ok: true }));
  app.use(jsonErrorHandler);
  return app;
}

const app = buildApp();

describe('hasForbiddenKey', () => {
  it('detects top-level and nested forbidden keys', () => {
    expect(hasForbiddenKey({ name: 'x' })).toBe(false);
    expect(hasForbiddenKey(JSON.parse('{"__proto__":{"x":1}}'))).toBe(true);
    expect(hasForbiddenKey(JSON.parse('{"a":{"constructor":1}}'))).toBe(true);
  });
});

describe('JSON body hardening', () => {
  it('accepts a valid JSON object body', async () => {
    const res = await request(app).post('/json').send({ name: 'Grant Fund' });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.body.name).toBe('Grant Fund');
  });

  it('rejects payloads over 10kb with 413', async () => {
    const res = await request(app)
      .post('/json')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ data: 'x'.repeat(11 * 1024) }));
    expect(res.statusCode).toBe(413);
    expect(res.body.error).toBe('Payload too large');
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(app)
      .post('/json')
      .set('Content-Type', 'application/json')
      .send('{ "name": ');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid JSON payload');
  });

  it.each(['__proto__', 'constructor', 'prototype'])(
    'rejects payloads containing %s with 400',
    async (key) => {
      const res = await request(app)
        .post('/json')
        .set('Content-Type', 'application/json')
        .send(`{ "${key}": { "polluted": true } }`);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Forbidden key in JSON payload');
    }
  );

  it('rejects nested prototype-pollution keys with 400', async () => {
    const res = await request(app)
      .post('/json')
      .set('Content-Type', 'application/json')
      .send('{ "outer": { "__proto__": { "x": 1 } } }');
    expect(res.statusCode).toBe(400);
  });

  it('rejects invalid body shape (array) with 400', async () => {
    const res = await request(app).post('/object').send([1, 2, 3]);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid request body');
  });

  it('does not leak internals in error responses', async () => {
    const res = await request(app)
      .post('/json')
      .set('Content-Type', 'application/json')
      .send('{ bad');
    expect(res.text).not.toMatch(/\/Users\/|node_modules|SyntaxError|at \w+ \(/);
  });
});
