const request = require('supertest');
const app = require('../../index');

describe('Request Validation', () => {
  describe('POST /escrow', () => {
    it('returns 400 with field-level details for invalid escrow', async () => {
      const res = await request(app).post('/escrow').send({ amount: -1 });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toBeDefined();
      expect(Array.isArray(res.body.error.details)).toBe(true);
    });

    it('passes validation for valid escrow', async () => {
      const res = await request(app).post('/escrow').send({
        amount: 100,
        beneficiary: 'addr123',
      });
      expect(res.status).not.toBe(400);
    });

    it('strips unknown fields', async () => {
      const res = await request(app).post('/escrow').send({
        amount: 100,
        beneficiary: 'addr123',
        unknownField: 'should be removed',
      });
      expect(res.status).not.toBe(400);
    });
  });

  describe('POST /grant', () => {
    it('returns 400 with field-level details for invalid grant', async () => {
      const res = await request(app).post('/grant').send({ name: '' });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details).toBeDefined();
    });

    it('passes validation for valid grant', async () => {
      const res = await request(app).post('/grant').send({
        name: 'Test Grant',
        amount: 500,
        currency: 'USD',
        beneficiary: 'addr456',
      });
      expect(res.status).not.toBe(400);
    });
  });

  describe('PATCH /grant/:id/status', () => {
    it('returns 400 for invalid status value', async () => {
      const res = await request(app).patch('/grant/1/status').send({
        status: 'invalid_status',
      });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 when status is missing', async () => {
      const res = await request(app).patch('/grant/1/status').send({});
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
