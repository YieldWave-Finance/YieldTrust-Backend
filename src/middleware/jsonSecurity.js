/**
 * Reusable JSON request hardening middleware/helpers.
 *
 * Future POST/escrow/trust-fund routes should rely on the app-level
 * `jsonBodyParser` + `sanitizeJsonBody` (mounted in index.js) and add
 * `requireObjectBody` (or stricter route-specific field validation) on the
 * route itself. Parser errors are handled centrally by `jsonErrorHandler`.
 */
const express = require('express');

// Conservative JSON body parser: small limit, reject non-object/array roots.
const jsonBodyParser = express.json({ limit: '10kb', strict: true });

// Prototype-pollution keys that must never appear anywhere in a JSON payload.
const FORBIDDEN_KEYS = ['__proto__', 'prototype', 'constructor'];

// Recursively check a parsed JSON value for forbidden keys. Depth is bounded
// because the payload itself is capped at 10kb by the parser above.
function hasForbiddenKey(value) {
  if (value === null || typeof value !== 'object') return false;
  for (const key of Object.getOwnPropertyNames(value)) {
    if (FORBIDDEN_KEYS.includes(key)) return true;
    if (hasForbiddenKey(value[key])) return true;
  }
  return false;
}

// Reject payloads carrying prototype-pollution keys. Treats req.body as fully
// untrusted and does not mutate it.
function sanitizeJsonBody(req, res, next) {
  if (hasForbiddenKey(req.body)) {
    return res.status(400).json({ error: 'Forbidden key in JSON payload' });
  }
  next();
}

// Route-specific guard for endpoints that expect a JSON object body.
function requireObjectBody(req, res, next) {
  const body = req.body;
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  next();
}

// Centralized handler for JSON parser failures. Returns simple, deterministic
// errors and never leaks stack traces, raw bodies, internal error objects,
// dependency versions, or filesystem paths. Non-parser errors are delegated to
// the next error handler.
function jsonErrorHandler(err, req, res, next) {
  if (!err) return next();
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({ error: 'Payload too large' });
  }
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  return next(err);
}

module.exports = {
  jsonBodyParser,
  sanitizeJsonBody,
  requireObjectBody,
  jsonErrorHandler,
  hasForbiddenKey,
  FORBIDDEN_KEYS
};
