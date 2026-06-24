const express = require('express');
const router = express.Router();

const escrowRoutes = require('./escrow');
const grantRoutes = require('./grant');

router.use('/escrow', escrowRoutes);
router.use('/grant', grantRoutes);

module.exports = router;
