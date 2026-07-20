const express = require('express');
const router = express.Router();
const { escrowService } = require('../services/dataStore');

/**
 * GET /escrow
 * List all escrow contracts
 */
router.get('/', (req, res) => {
  try {
    const escrows = escrowService.getAll();
    res.json({
      success: true,
      data: escrows,
      count: escrows.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /escrow/:id
 * Get a specific escrow contract by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const escrow = escrowService.getById(id);

    if (!escrow) {
      return res.status(404).json({
        success: false,
        error: `Escrow with ID ${id} not found`,
      });
    }

    res.json({
      success: true,
      data: escrow,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /escrow
 * Create a new escrow contract
 * Request body: { amount, beneficiary, releaseDate, description }
 */
router.post('/', (req, res) => {
  try {
    const { amount, beneficiary, releaseDate, description } = req.body;

    // Validation
    if (!amount || !beneficiary) {
      return res.status(400).json({
        success: false,
        error: 'amount and beneficiary are required',
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'amount must be a positive number',
      });
    }

    const newEscrow = escrowService.create({
      amount,
      beneficiary,
      releaseDate: releaseDate || null,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Escrow contract created successfully',
      data: newEscrow,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /escrow/:id
 * Update an existing escrow contract
 * Request body: { amount, beneficiary, releaseDate, description, status }
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const escrow = escrowService.getById(id);

    if (!escrow) {
      return res.status(404).json({
        success: false,
        error: `Escrow with ID ${id} not found`,
      });
    }

    const { amount, beneficiary, releaseDate, description, status } = req.body;

    // Validate amount if provided
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'amount must be a positive number',
        });
      }
    }

    const updatedEscrow = escrowService.update(id, {
      ...(amount !== undefined && { amount }),
      ...(beneficiary && { beneficiary }),
      ...(releaseDate !== undefined && { releaseDate }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
    });

    res.json({
      success: true,
      message: 'Escrow contract updated successfully',
      data: updatedEscrow,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /escrow/:id
 * Delete an escrow contract
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const escrow = escrowService.getById(id);

    if (!escrow) {
      return res.status(404).json({
        success: false,
        error: `Escrow with ID ${id} not found`,
      });
    }

    const deleted = escrowService.delete(id);

    if (deleted) {
      res.json({
        success: true,
        message: 'Escrow contract deleted successfully',
        data: { id: parseInt(id, 10) },
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete escrow contract',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
