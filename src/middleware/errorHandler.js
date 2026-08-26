/**
 * Central error-handling middleware.
 * Must be registered AFTER all routes in Express (4-argument signature).
 */
const logger = require('../utils/logger');

// next is required for Express's 4-arg error handler signature
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  logger.error({
    err: { message: err.message, stack: err.stack, name: err.name },
    req: req ? { method: req.method, url: req.url, id: req.id } : undefined,
  }, `error handling request: ${message}`);

  logger.error('Request failed', {
    status,
    method: req.method,
    path: req.originalUrl,
    error: {
      name: err.name,
      message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    },
  });

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
