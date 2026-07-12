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

describe('Protected Escrow Routes', () => {
  beforeAll(() => {
    process.env.ADMIN_API_KEY = 'admin_secret_key';
    process.env.GRANT_MANAGER_API_KEY = 'manager_secret_key';
    process.env.ESCROW_OWNER_API_KEY = 'owner_secret_key';
  });

  const escrowId = '123';

  describe('POST /escrow/:escrowId/fund', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).post(`/escrow/${escrowId}/fund`);
      expect(res.statusCode).toBe(401);
    });

    it('returns 403 with insufficient role', async () => {
      const res = await request(app)
        .post(`/escrow/${escrowId}/fund`)
        .set('Authorization', `Bearer ${process.env.ESCROW_OWNER_API_KEY}`);
      expect(res.statusCode).toBe(403);
    });

    it('returns 200 with admin token', async () => {
      const res = await request(app)
        .post(`/escrow/${escrowId}/fund`)
        .set('Authorization', `Bearer ${process.env.ADMIN_API_KEY}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /escrow/:escrowId/release', () => {
    it('returns 200 with grant manager token', async () => {
      const res = await request(app)
        .post(`/escrow/${escrowId}/release`)
        .set('Authorization', `Bearer ${process.env.GRANT_MANAGER_API_KEY}`);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /escrow/:escrowId/withdraw', () => {
    it('returns 200 with escrow owner token', async () => {
      const res = await request(app)
        .post(`/escrow/${escrowId}/withdraw`)
        .set('Authorization', `Bearer ${process.env.ESCROW_OWNER_API_KEY}`);
      expect(res.statusCode).toBe(200);
    });
  });
});
