const request = require('supertest');
const app = require('../../index');

describe('GET /', () => {
  it('returns project status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('project');
    expect(res.body).toHaveProperty('status');
  });
});

describe('GET /escrow', () => {
  it('returns list of escrow contracts', async () => {
    const res = await request(app).get('/escrow');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /grant', () => {
  it('returns grant stream info', async () => {
    const res = await request(app).get('/grant');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('project', 'Grant Stream');
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
