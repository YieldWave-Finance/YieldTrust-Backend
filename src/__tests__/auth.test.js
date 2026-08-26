const request = require('supertest');
const app = require('../../index');
const { API_KEY, generateToken, revokeToken } = require('../middleware/auth');

describe('Authentication Middleware', () => {
  it('allows GET / without auth', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('allows GET /escrow without auth', async () => {
    const res = await request(app).get('/escrow');
    expect(res.statusCode).toBe(200);
  });

  it('allows GET /grant without auth', async () => {
    const res = await request(app).get('/grant');
    expect(res.statusCode).toBe(200);
  });

  it('allows GET /escrow/:id without auth', async () => {
    const res = await request(app).get('/escrow/1');
    expect(res.statusCode).not.toBe(401);
  });

  it('rejects POST without auth', async () => {
    const res = await request(app).post('/escrow').send({});
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects PUT without auth', async () => {
    const res = await request(app).put('/escrow/1').send({ status: 'funded' });
    expect(res.statusCode).toBe(401);
  });

  it('rejects PATCH without auth', async () => {
    const res = await request(app).patch('/grant/1/status').send({ status: 'approved' });
    expect(res.statusCode).toBe(401);
  });

  it('rejects DELETE without auth', async () => {
    const res = await request(app).delete('/escrow/1');
    expect(res.statusCode).toBe(401);
  });

  it('accepts POST with valid API key', async () => {
    const res = await request(app)
      .post('/escrow')
      .set('x-api-key', API_KEY)
      .send({});
    expect(res.statusCode).not.toBe(401);
  });

  it('accepts POST with valid Bearer token', async () => {
    const token = generateToken();
    const res = await request(app)
      .post('/escrow')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).not.toBe(401);
    revokeToken(token);
  });

  it('rejects POST with invalid API key', async () => {
    const res = await request(app)
      .post('/escrow')
      .set('x-api-key', 'invalid-key')
      .send({});
    expect(res.statusCode).toBe(401);
  });

  it('rejects POST with invalid Bearer token', async () => {
    const res = await request(app)
      .post('/escrow')
      .set('Authorization', 'Bearer invalid-token')
      .send({});
    expect(res.statusCode).toBe(401);
  });
});
