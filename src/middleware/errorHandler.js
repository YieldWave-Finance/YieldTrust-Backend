const { errorResponse } = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  errorResponse(res, { status, message, code });
}

module.exports = errorHandler;
