const express = require('express');

// --- Reusable security middleware/helpers ---------------------------------
// These are exported so future POST/escrow/trust-fund routes (none exist yet)
// and the test suite can mount the same hardening that the app uses.

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

// Route-specific guard for endpoints that expect a JSON object body. Future
// POST routes should mount this after jsonBodyParser + sanitizeJsonBody.
function requireObjectBody(req, res, next) {
  const body = req.body;
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  next();
}

// Centralized error handler for JSON parser failures. Returns simple,
// deterministic errors and never leaks stack traces, raw bodies, internal
// error objects, dependency versions, or filesystem paths.
function jsonErrorHandler(err, req, res, next) {
  if (!err) return next();
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({ error: 'Payload too large' });
  }
  if (err.status === 400 || err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  return res.status(400).json({ error: 'Invalid request' });
}

// --- Application ----------------------------------------------------------
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    project: 'Grant Stream',
    status: 'Tracking Grants',
    contract: 'CD6OGC46OFCV52IJQKEDVKLX5ASA3ZMSTHAAZQIPDSJV6VZ3KUJDEP4D'
  });
});

// Parse + harden JSON for every route declared after this point. No
// production POST endpoints exist yet; when they are added they get this
// hardening automatically and should also mount requireObjectBody (and their
// own field validation) on the route.
app.use(jsonBodyParser, sanitizeJsonBody);

// Must be registered last so it can catch parser errors raised above.
app.use(jsonErrorHandler);

if (require.main === module) {
  app.listen(port, () => console.log('Grant API running'));
}

module.exports = {
  app,
  jsonBodyParser,
  sanitizeJsonBody,
  requireObjectBody,
  jsonErrorHandler,
  hasForbiddenKey,
  FORBIDDEN_KEYS
};
