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
  it('returns escrow routes active message', async () => {
    const res = await request(app).get('/escrow');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Escrow routes active');
  });
});

describe('GET /grant', () => {
  it('returns grant stream info', async () => {
    const res = await request(app).get('/grant');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('project', 'Grant Stream');
  });
});
