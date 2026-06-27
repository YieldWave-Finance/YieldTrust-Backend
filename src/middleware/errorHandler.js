/**
 * Central error-handling middleware.
 * Must be registered AFTER all routes in Express (4-argument signature).
 */
// next is required for Express's 4-arg error handler signature
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
