const express = require('express');
const router = express.Router();
const { prisma } = require('../lib/db');

// GET /escrow - list all escrows
router.get('/', async (req, res, next) => {
  try {
    const escrows = await prisma.escrow.findMany();
    res.json(escrows);
  } catch (error) {
    next(error);
  }
});

// GET /escrow/:id - get an escrow by id
router.get('/:id', async (req, res, next) => {
  try {
    const escrow = await prisma.escrow.findUnique({
      where: { id: req.params.id },
    });
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
    res.json(escrow);
  } catch (error) {
    next(error);
  }
});

// POST /escrow - create a new escrow
router.post('/', async (req, res, next) => {
  try {
    const { fund_id, amount, status } = req.body;
    const escrow = await prisma.escrow.create({
      data: {
        fund_id,
        amount,
        status,
      },
    });
    res.status(201).json(escrow);
  } catch (error) {
    next(error);
  }
});

// PUT /escrow/:id - update an escrow
router.put('/:id', async (req, res, next) => {
  try {
    const escrow = await prisma.escrow.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(escrow);
  } catch (error) {
    next(error);
  }
});

// DELETE /escrow/:id - delete an escrow
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.escrow.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
