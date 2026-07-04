const request = require('supertest');
const app = require('../../index');
const errorHandler = require('../middleware/errorHandler');
const escrowAdapter = require('../services/escrowAdapter');

afterEach(() => {
  jest.restoreAllMocks();
  escrowAdapter.reset();
});

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

describe('escrow lifecycle routes', () => {
  const escrowId = 'escrow_abc123';

  it('rejects malformed escrow IDs before calling the adapter', async () => {
    const getEscrow = jest.spyOn(escrowAdapter, 'getEscrow');

    const res = await request(app).get('/escrow/not-valid!');

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Invalid escrow id',
      code: 'invalid_escrow_id',
    });
    expect(getEscrow).not.toHaveBeenCalled();
  });

  it('returns an escrow by ID through the adapter', async () => {
    jest.spyOn(escrowAdapter, 'getEscrow').mockResolvedValue({
      id: escrowId,
      status: 'pending',
      amount: 100,
      currency: 'USDC',
    });

    const res = await request(app).get(`/escrow/${escrowId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.escrow).toMatchObject({
      id: escrowId,
      status: 'pending',
      amount: 100,
      currency: 'USDC',
    });
    expect(escrowAdapter.getEscrow).toHaveBeenCalledWith(escrowId);
  });

  it('maps legal hold adapter failures to a 502 response', async () => {
    const error = new Error('upstream legal hold outage');
    error.code = 'LEGAL_HOLD_UNAVAILABLE';
    jest.spyOn(escrowAdapter, 'getEscrow').mockRejectedValue(error);

    const res = await request(app).get(`/escrow/${escrowId}`);

    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({
      error: 'Legal hold service unavailable',
      code: 'legal_hold_unavailable',
    });
  });

  it('returns adapter status errors for missing escrows', async () => {
    const res = await request(app).get(`/escrow/${escrowId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: 'Escrow not found',
      code: 'ESCROW_NOT_FOUND',
    });
  });

  it('creates escrows with a valid POST body', async () => {
    const payload = {
      beneficiary: 'GABC123BENEFICIARY',
      amount: 1250,
      currency: 'USDC',
    };
    jest.spyOn(escrowAdapter, 'createEscrow').mockResolvedValue({
      id: escrowId,
      status: 'pending',
      ...payload,
    });

    const res = await request(app).post('/escrow').send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.escrow).toMatchObject({
      id: escrowId,
      status: 'pending',
      ...payload,
    });
    expect(escrowAdapter.createEscrow).toHaveBeenCalledWith(payload);
  });

  it('rejects invalid escrow create payloads', async () => {
    const createEscrow = jest.spyOn(escrowAdapter, 'createEscrow');

    const res = await request(app)
      .post('/escrow')
      .send({ beneficiary: 'GABC123BENEFICIARY', amount: 0 });

    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe('invalid_escrow_payload');
    expect(createEscrow).not.toHaveBeenCalled();
  });

  it('rejects non-positive escrow amounts', async () => {
    const createEscrow = jest.spyOn(escrowAdapter, 'createEscrow');

    const res = await request(app).post('/escrow').send({
      beneficiary: 'GABC123BENEFICIARY',
      amount: 0,
      currency: 'USDC',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe('invalid_escrow_amount');
    expect(createEscrow).not.toHaveBeenCalled();
  });

  it('releases an escrow through the adapter', async () => {
    const payload = {
      milestoneId: 'milestone-1',
      proofHash: 'sha256:release-proof',
    };
    jest.spyOn(escrowAdapter, 'releaseEscrow').mockResolvedValue({
      id: escrowId,
      status: 'released',
      ...payload,
    });

    const res = await request(app)
      .post(`/escrow/${escrowId}/release`)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.escrow).toMatchObject({
      id: escrowId,
      status: 'released',
      ...payload,
    });
    expect(escrowAdapter.releaseEscrow).toHaveBeenCalledWith(escrowId, payload);
  });

  it('rejects release requests missing milestone proof data', async () => {
    const releaseEscrow = jest.spyOn(escrowAdapter, 'releaseEscrow');

    const res = await request(app)
      .post(`/escrow/${escrowId}/release`)
      .send({ milestoneId: 'milestone-1' });

    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe('invalid_release_payload');
    expect(releaseEscrow).not.toHaveBeenCalled();
  });

  it('cancels an escrow through the adapter', async () => {
    const payload = { reason: 'beneficiary failed verification' };
    jest.spyOn(escrowAdapter, 'cancelEscrow').mockResolvedValue({
      id: escrowId,
      status: 'cancelled',
      ...payload,
    });

    const res = await request(app)
      .post(`/escrow/${escrowId}/cancel`)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.escrow).toMatchObject({
      id: escrowId,
      status: 'cancelled',
      ...payload,
    });
    expect(escrowAdapter.cancelEscrow).toHaveBeenCalledWith(escrowId, payload);
  });

  it('rejects cancel requests without a reason', async () => {
    const cancelEscrow = jest.spyOn(escrowAdapter, 'cancelEscrow');

    const res = await request(app)
      .post(`/escrow/${escrowId}/cancel`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.code).toBe('invalid_cancel_payload');
    expect(cancelEscrow).not.toHaveBeenCalled();
  });
});

describe('escrow adapter lifecycle', () => {
  it('creates, reads, releases, and cancels escrow records', async () => {
    const created = await escrowAdapter.createEscrow({
      beneficiary: 'GBENEFICIARY',
      amount: 42,
      currency: 'USDC',
    });

    expect(created.id).toMatch(/^escrow_/);
    expect(created.status).toBe('pending');

    const fetched = await escrowAdapter.getEscrow(created.id);
    expect(fetched).toEqual(created);

    const released = await escrowAdapter.releaseEscrow(created.id, {
      milestoneId: 'milestone-1',
      proofHash: 'sha256:release-proof',
    });
    expect(released).toMatchObject({
      id: created.id,
      status: 'released',
      milestoneId: 'milestone-1',
    });

    const cancelled = await escrowAdapter.cancelEscrow(created.id, {
      reason: 'operator override',
    });
    expect(cancelled).toMatchObject({
      id: created.id,
      status: 'cancelled',
      reason: 'operator override',
    });
  });
});

describe('error handler middleware', () => {
  it('serializes status-aware errors', () => {
    const err = new Error('bad gateway');
    err.statusCode = 502;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    errorHandler(err, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: 'bad gateway' });
  });
});

describe('GET /grant', () => {
  it('returns grant stream info', async () => {
    const res = await request(app).get('/grant');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('project', 'Grant Stream');
  });
});
