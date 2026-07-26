const express = require('express');
const router = express.Router();
const { grantService } = require('../services/dataStore');
const { rules, validateBody, validateIdParam, validateQuery } = require('../middleware/validation');

const GRANT_STATUSES = ['pending', 'approved', 'disbursed', 'rejected'];

/**
 * GET /grant
 * List all grants or filter by query parameters
 * Query params: ?beneficiary=<address>&status=<status>
 */
router.get('/', validateQuery(['beneficiary', 'status']), (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /grant/:id
 * Get a specific grant by ID
 */
router.get('/:id', validateIdParam(), (req, res) => {
  try {
    const { id } = req.params;
    const grant = grantService.getById(id);

    if (!grant) {
      return res.status(404).json({
        success: false,
        error: `Grant with ID ${id} not found`,
      });
    }

    res.json({
      success: true,
      data: grant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /grant
 * Create a new grant
 * Request body: { name, amount, currency, beneficiary, description }
 */
router.post(
  '/',
  validateBody([
    rules.requiredString('name'),
    rules.positiveNumber('amount'),
    rules.requiredString('currency'),
    rules.requiredString('beneficiary'),
    rules.optionalString('description'),
  ]),
  (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /grant/:id
 * Update an existing grant
 * Request body: { name, amount, currency, beneficiary, description, status }
 */
router.put(
  '/:id',
  validateIdParam(),
  validateBody([
    rules.optionalString('name'),
    rules.optionalPositiveNumber('amount'),
    rules.optionalString('currency'),
    rules.optionalString('beneficiary'),
    rules.optionalString('description'),
    rules.optionalEnum('status', GRANT_STATUSES),
  ]),
  (req, res) => {
  try {
    const { id } = req.params;
    const grant = grantService.getById(id);

    if (!grant) {
      return res.status(404).json({
        success: false,
        error: `Grant with ID ${id} not found`,
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
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /grant/:id/status
 * Update grant status (e.g., pending, approved, disbursed)
 * Request body: { status }
 */
router.patch(
  '/:id/status',
  validateIdParam(),
  validateBody([rules.requiredString('status'), rules.optionalEnum('status', GRANT_STATUSES)]),
  (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const grant = grantService.getById(id);

    if (!grant) {
      return res.status(404).json({
        success: false,
        error: `Grant with ID ${id} not found`,
      });
    }

    const updatedGrant = grantService.updateStatus(id, status);

    res.json({
      success: true,
      message: `Grant status updated to ${status}`,
      data: updatedGrant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /grant/:id
 * Delete a grant
 */
router.delete('/:id', validateIdParam(), (req, res) => {
  try {
    const { id } = req.params;
    const grant = grantService.getById(id);

    if (!grant) {
      return res.status(404).json({
        success: false,
        error: `Grant with ID ${id} not found`,
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
      res.status(500).json({
        success: false,
        error: 'Failed to delete grant',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
