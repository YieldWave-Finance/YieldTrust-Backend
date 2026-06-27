const express = require('express');
const router = express.Router();

// GET /grant — list all grants
router.get('/', (req, res) => {
  res.json({
    project: 'Grant Stream',
    status: 'Tracking Grants',
    contract: 'CD6OGC46OFCV52IJQKEDVKLX5ASA3ZMSTHAAZQIPDSJV6VZ3KUJDEP4D',
  });
});

module.exports = router;
