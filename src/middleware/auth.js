/**
 * Authentication and Authorization Middleware
 *
 * Supports two auth methods:
 * 1. API Key — via x-api-key header
 * 2. Bearer token — via Authorization: Bearer <token> header
 *
 * Public reads (GET routes) are accessible without auth.
 * Mutating routes (POST, PUT, DELETE, PATCH) require authentication.
 */

const crypto = require('crypto');

// In-memory token store (in production, use Redis or database)
const validTokens = new Set();

// Generate a default API key if none configured
const API_KEY = process.env.API_KEY || crypto.randomBytes(32).toString('hex');

/**
 * Authenticate request using API key or Bearer token.
 * Sets req.authenticated = true and req.authMethod on success.
 */
function authenticate(req, res, next) {
  // Skip auth for public read endpoints.
  if (req.method === 'GET') {
    req.authenticated = false;
    return next();
  }

  // Check API key
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === API_KEY) {
    req.authenticated = true;
    req.authMethod = 'api-key';
    return next();
  }

  // Check Bearer token
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (validTokens.has(token)) {
      req.authenticated = true;
      req.authMethod = 'bearer';
      return next();
    }
  }

  return res.status(401).json({
    success: false,
    error: 'Authentication required. Provide x-api-key header or Bearer token.',
  });
}

/**
 * Authorization middleware — requires specific role.
 * Usage: router.post('/admin', requireRole('admin'), handler)
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.authenticated) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    // In production, check user roles from database
    // For now, all authenticated users have 'user' role
    req.role = 'user';
    if (role && req.role !== role && role !== 'user') {
      return res.status(403).json({ success: false, error: `Requires ${role} role` });
    }
    next();
  };
}

/**
 * Generate a new bearer token (for testing/demo).
 */
function generateToken() {
  const token = crypto.randomBytes(32).toString('hex');
  validTokens.add(token);
  return token;
}

/**
 * Revoke a bearer token.
 */
function revokeToken(token) {
  return validTokens.delete(token);
}

module.exports = { authenticate, requireRole, generateToken, revokeToken, API_KEY };
