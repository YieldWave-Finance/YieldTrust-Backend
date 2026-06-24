const express = require('express');
const router = express.Router();

// GET /escrow — list all escrow contracts
router.get('/', (req, res) => {
  res.json({ message: 'Escrow routes active' });
});

module.exports = router;
