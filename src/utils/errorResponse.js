function errorResponse(res, { status = 500, message = 'Internal Server Error', code = 'INTERNAL_ERROR', details = null }) {
  const body = { error: { message, code } };
  if (details) body.error.details = details;
  return res.status(status).json(body);
}

const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
};

module.exports = { errorResponse, ERROR_CODES };
