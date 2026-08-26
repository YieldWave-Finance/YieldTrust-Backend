const request = require('supertest');
const app = require('../../index');

describe('request validation middleware', () => {
  it('rejects invalid route ids before lookup', async () => {
    const res = await request(app).get('/escrow/not-a-number');

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      error: 'Invalid request',
      details: ['id must be a positive integer'],
    });
  });

  it('rejects unsupported grant query parameters', async () => {
    const res = await request(app).get('/grant?sort=createdAt');

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      error: 'Invalid request',
      details: ['sort is not a supported query parameter'],
    });
  });

  it('rejects malformed escrow creation bodies', async () => {
    const res = await request(app).post('/escrow').send({
      amount: -10,
      beneficiary: '',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual([
      'amount must be a positive number',
      'beneficiary must be a non-empty string',
    ]);
  });

  it('rejects invalid grant status updates', async () => {
    const res = await request(app)
      .patch('/grant/1/status')
      .send({ status: 'archived' });

    expect(res.statusCode).toBe(400);
    expect(res.body.details).toEqual([
      'status must be one of: pending, approved, disbursed, rejected',
    ]);
  });
});
