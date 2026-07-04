const express = require('express');
const router = express.Router();

const escrowAdapter = require('../services/escrowAdapter');

const ESCROW_ID_PATTERN = /^escrow_[A-Za-z0-9_-]{6,72}$/;
const LEGAL_HOLD_CODES = new Set([
  'LEGAL_HOLD_UNAVAILABLE',
  'LEGAL_HOLD_SERVICE_UNAVAILABLE',
  'LEGAL_HOLD_UPSTREAM_FAILURE',
]);

function isPresent(value) {
  return value !== undefined && value !== null && value !== '';
}

function validateEscrowId(req, res, next) {
  if (!ESCROW_ID_PATTERN.test(req.params.escrowId)) {
    return res.status(400).json({
      error: 'Invalid escrow id',
      code: 'invalid_escrow_id',
    });
  }

  return next();
}

function validateCreatePayload(req, res, next) {
  const { beneficiary, amount, currency } = req.body || {};
  if (!isPresent(beneficiary) || !isPresent(amount) || !isPresent(currency)) {
    return res.status(400).json({
      error: 'beneficiary, amount, and currency are required',
      code: 'invalid_escrow_payload',
    });
  }

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({
      error: 'amount must be a positive number',
      code: 'invalid_escrow_amount',
    });
  }

  return next();
}

function validateReleasePayload(req, res, next) {
  const { milestoneId, proofHash } = req.body || {};
  if (!isPresent(milestoneId) || !isPresent(proofHash)) {
    return res.status(400).json({
      error: 'milestoneId and proofHash are required',
      code: 'invalid_release_payload',
    });
  }

  return next();
}

function validateCancelPayload(req, res, next) {
  if (!isPresent((req.body || {}).reason)) {
    return res.status(400).json({
      error: 'reason is required',
      code: 'invalid_cancel_payload',
    });
  }

  return next();
}

function handleAdapterError(res, error) {
  if (LEGAL_HOLD_CODES.has(error.code)) {
    return res.status(502).json({
      error: 'Legal hold service unavailable',
      code: 'legal_hold_unavailable',
    });
  }

  return res.status(error.statusCode || error.status || 500).json({
    error: error.message || 'Escrow adapter failed',
    code: error.code || 'escrow_adapter_failed',
  });
}

router.get('/', (req, res) => {
  res.json({ message: 'Escrow routes active' });
});

router.post('/', validateCreatePayload, async (req, res) => {
  try {
    const escrow = await escrowAdapter.createEscrow(req.body);
    res.status(201).json({ escrow });
  } catch (error) {
    handleAdapterError(res, error);
  }
});

router.get('/:escrowId', validateEscrowId, async (req, res) => {
  try {
    const escrow = await escrowAdapter.getEscrow(req.params.escrowId);
    res.json({ escrow });
  } catch (error) {
    handleAdapterError(res, error);
  }
});

router.post(
  '/:escrowId/release',
  validateEscrowId,
  validateReleasePayload,
  async (req, res) => {
    try {
      const escrow = await escrowAdapter.releaseEscrow(
        req.params.escrowId,
        req.body
      );
      res.json({ escrow });
    } catch (error) {
      handleAdapterError(res, error);
    }
  }
);

router.post(
  '/:escrowId/cancel',
  validateEscrowId,
  validateCancelPayload,
  async (req, res) => {
    try {
      const escrow = await escrowAdapter.cancelEscrow(
        req.params.escrowId,
        req.body
      );
      res.json({ escrow });
    } catch (error) {
      handleAdapterError(res, error);
    }
  }
);

module.exports = router;
