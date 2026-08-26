const express = require('express');
const router = express.Router();
const { grantService } = require('../services/dataStore');
const { errorResponse, ERROR_CODES } = require('../utils/errorResponse');
const { validate, grantCreateSchema, grantUpdateSchema, statusUpdateSchema } = require('../middleware/validation');

/**
 * GET /grant
 * List all grants or filter by query parameters
 * Query params: ?beneficiary=<address>&status=<status>
 */
router.get('/', (req, res) => {
  try {
    const { beneficiary, status } = req.query;
    let grants = grantService.getAll();

    // Filter by beneficiary if provided
    if (beneficiary) {
      grants = grants.filter((g) => g.beneficiary === beneficiary);
    }

    // Filter by status if provided
    if (status) {
      grants = grants.filter((g) => g.status === status);
    }

    res.json({
      success: true,
      data: grants,
      count: grants.length,
      project: 'Grant Stream',
      contract: 'CD6OGC46OFCV52IJQKEDVKLX5ASA3ZMSTHAAZQIPDSJV6VZ3KUJDEP4D',
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
 * GET /grant/:id
 * Get a specific grant by ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const grant = grantService.getById(id);

    if (!grant) {
      return errorResponse(res, {
        status: 404,
        message: `Grant with ID ${id} not found`,
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    res.json({
      success: true,
      data: grant,
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
 * POST /grant
 * Create a new grant
 * Request body: { name, amount, currency, beneficiary, description }
 */
router.post('/', validate(grantCreateSchema), (req, res) => {
  try {
    const { name, amount, currency, beneficiary, description } = req.body;

    const newGrant = grantService.create({
      name,
      amount,
      currency,
      beneficiary,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Grant created successfully',
      data: newGrant,
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
 * PUT /grant/:id
 * Update an existing grant
 * Request body: { name, amount, currency, beneficiary, description, status }
 */
router.put('/:id', validate(grantUpdateSchema), (req, res) => {
  try {
    const { id } = req.params;
    const grant = grantService.getById(id);

    if (!grant) {
      return errorResponse(res, {
        status: 404,
        message: `Grant with ID ${id} not found`,
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const { name, amount, currency, beneficiary, description, status } =
      req.body;

    const updatedGrant = grantService.update(id, {
      ...(name && { name }),
      ...(amount !== undefined && { amount }),
      ...(currency && { currency }),
      ...(beneficiary && { beneficiary }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
    });

    res.json({
      success: true,
      message: 'Grant updated successfully',
      data: updatedGrant,
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
 * PATCH /grant/:id/status
 * Update grant status (e.g., pending, approved, disbursed)
 * Request body: { status }
 */
router.patch('/:id/status', validate(statusUpdateSchema), (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const grant = grantService.getById(id);

    if (!grant) {
      return errorResponse(res, {
        status: 404,
        message: `Grant with ID ${id} not found`,
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const updatedGrant = grantService.updateStatus(id, status);

    res.json({
      success: true,
      message: `Grant status updated to ${status}`,
      data: updatedGrant,
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
 * DELETE /grant/:id
 * Delete a grant
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const grant = grantService.getById(id);

    if (!grant) {
      return errorResponse(res, {
        status: 404,
        message: `Grant with ID ${id} not found`,
        code: ERROR_CODES.NOT_FOUND,
      });
    }

    const deleted = grantService.delete(id);

    if (deleted) {
      res.json({
        success: true,
        message: 'Grant deleted successfully',
        data: { id: parseInt(id, 10) },
      });
    } else {
      errorResponse(res, {
        status: 500,
        message: 'Failed to delete grant',
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
