const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

// GET /escrow — list all escrow contracts
router.get('/', (req, res) => {
  res.json({ message: 'Escrow routes active' });
});

// POST /escrow/:escrowId/fund
router.post('/:escrowId/fund', auth(['admin', 'grant_manager']), (req, res) => {
  res.json({ message: `Escrow ${req.params.escrowId} funded successfully` });
});

// POST /escrow/:escrowId/release
router.post('/:escrowId/release', auth(['admin', 'grant_manager']), (req, res) => {
  res.json({ message: `Escrow ${req.params.escrowId} released successfully` });
});

// POST /escrow/:escrowId/withdraw
router.post('/:escrowId/withdraw', auth(['admin', 'escrow_owner']), (req, res) => {
  res.json({ message: `Escrow ${req.params.escrowId} withdrawn successfully` });
});

module.exports = router;
