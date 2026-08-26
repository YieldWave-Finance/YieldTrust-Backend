const express = require('express');
const router = express.Router();
const { escrowService } = require('../services/dataStore');
const { rules, validateBody, validateIdParam } = require('../middleware/validation');

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
    errorResponse(res, {
      status: 500,
      message: error.message,
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * GET /escrow/:id
 * Get a specific escrow contract by ID
 */
router.get('/:id', validateIdParam(), (req, res) => {
  try {
    const { id } = req.params;
    const escrow = escrowService.getById(id);

    if (!escrow) {
      return errorResponse(res, {
        status: 404,
        message: `Escrow with ID ${id} not found`,
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    res.json({
      success: true,
      data: escrow,
    });
  } catch (error) {
    errorResponse(res, {
      status: 500,
      message: error.message,
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * POST /escrow
 * Create a new escrow contract
 * Request body: { amount, beneficiary, releaseDate, description }
 */
router.post(
  '/',
  validateBody([
    rules.positiveNumber('amount'),
    rules.requiredString('beneficiary'),
    rules.optionalString('releaseDate'),
    rules.optionalString('description'),
  ]),
  (req, res) => {
  try {
    const { amount, beneficiary, releaseDate, description } = req.body;

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
    errorResponse(res, {
      status: 500,
      message: error.message,
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * PUT /escrow/:id
 * Update an existing escrow contract
 * Request body: { amount, beneficiary, releaseDate, description, status }
 */
router.put(
  '/:id',
  validateIdParam(),
  validateBody([
    rules.optionalPositiveNumber('amount'),
    rules.optionalString('beneficiary'),
    rules.optionalString('releaseDate'),
    rules.optionalString('description'),
    rules.optionalString('status'),
  ]),
  (req, res) => {
  try {
    const { id } = req.params;
    const escrow = escrowService.getById(id);

    if (!escrow) {
      return errorResponse(res, {
        status: 404,
        message: `Escrow with ID ${id} not found`,
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const { amount, beneficiary, releaseDate, description, status } = req.body;

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
    errorResponse(res, {
      status: 500,
      message: error.message,
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

/**
 * DELETE /escrow/:id
 * Delete an escrow contract
 */
router.delete('/:id', validateIdParam(), (req, res) => {
  try {
    const { id } = req.params;
    const escrow = escrowService.getById(id);

    if (!escrow) {
      return errorResponse(res, {
        status: 404,
        message: `Escrow with ID ${id} not found`,
        code: ERROR_CODES.NOT_FOUND,
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
      errorResponse(res, {
        status: 500,
        message: 'Failed to delete escrow contract',
        code: ERROR_CODES.INTERNAL_ERROR,
      });
    }
  } catch (error) {
    errorResponse(res, {
      status: 500,
      message: error.message,
      code: ERROR_CODES.INTERNAL_ERROR,
    });
  }
});

module.exports = router;
