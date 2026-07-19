const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/db');

// GET /grant - list all grants (TrustFunds)
router.get('/', async (req, res, next) => {
  try {
    const grants = await prisma.trustFund.findMany();
    res.json(grants);
  } catch (error) {
    next(error);
  }
});

// GET /grant/:id - get a grant by id
router.get('/:id', async (req, res, next) => {
  try {
    const grant = await prisma.trustFund.findUnique({
      where: { id: req.params.id },
    });
    if (!grant) return res.status(404).json({ error: 'Grant not found' });
    res.json(grant);
  } catch (error) {
    next(error);
  }
});

// POST /grant - create a new grant
router.post('/', async (req, res, next) => {
  try {
    const { name, total_amount, currency, beneficiary, contract_address } = req.body;
    const grant = await prisma.trustFund.create({
      data: {
        name,
        total_amount,
        currency,
        beneficiary,
        contract_address,
      },
    });
    res.status(201).json(grant);
  } catch (error) {
    next(error);
  }
});

// PUT /grant/:id - update a grant
router.put('/:id', async (req, res, next) => {
  try {
    const grant = await prisma.trustFund.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(grant);
  } catch (error) {
    next(error);
  }
});

// DELETE /grant/:id - delete a grant
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.trustFund.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
