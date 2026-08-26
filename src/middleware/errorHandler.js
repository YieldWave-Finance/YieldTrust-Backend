const logger = require('../utils/logger');
const { errorResponse } = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  logger.error({
    err: { message: err.message, stack: err.stack, name: err.name },
    req: req ? { method: req.method, url: req.url, id: req.id } : undefined,
  }, `error handling request: ${message}`);

  errorResponse(res, { status, message, code });
}

module.exports = errorHandler;
