const escrowStore = new Map();

function cloneRecord(record) {
  return { ...record };
}

async function createEscrow(payload) {
  const id = `escrow_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const record = {
    id,
    status: 'pending',
    beneficiary: payload.beneficiary,
    amount: payload.amount,
    currency: payload.currency,
  };

  escrowStore.set(id, record);
  return cloneRecord(record);
}

async function getEscrow(id) {
  const record = escrowStore.get(id);
  if (!record) {
    const error = new Error('Escrow not found');
    error.statusCode = 404;
    error.code = 'ESCROW_NOT_FOUND';
    throw error;
  }

  return cloneRecord(record);
}

async function releaseEscrow(id, payload) {
  const record = await getEscrow(id);
  const released = {
    ...record,
    status: 'released',
    milestoneId: payload.milestoneId,
    proofHash: payload.proofHash,
  };

  escrowStore.set(id, released);
  return cloneRecord(released);
}

async function cancelEscrow(id, payload) {
  const record = await getEscrow(id);
  const cancelled = {
    ...record,
    status: 'cancelled',
    reason: payload.reason,
  };

  escrowStore.set(id, cancelled);
  return cloneRecord(cancelled);
}

function reset() {
  escrowStore.clear();
}

module.exports = {
  createEscrow,
  getEscrow,
  releaseEscrow,
  cancelEscrow,
  reset,
};
