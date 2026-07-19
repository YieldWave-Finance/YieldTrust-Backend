const request = require('supertest');
const app = require('../../index');

jest.mock('../lib/db', () => ({
  prisma: {
    trustFund: {
      findMany: jest.fn().mockResolvedValue([{ id: '1', name: 'Mock Grant' }])
    },
    escrow: {
      findMany: jest.fn().mockResolvedValue([{ id: '1', amount: '100' }])
    }
  }
}));

describe('GET /', () => {
  it('returns project status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('project');
    expect(res.body).toHaveProperty('status');
  });
});

describe('GET /escrow', () => {
  it('returns escrow list', async () => {
    const res = await request(app).get('/escrow');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });
});

describe('GET /grant', () => {
  it('returns grant list', async () => {
    const res = await request(app).get('/grant');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });
});
