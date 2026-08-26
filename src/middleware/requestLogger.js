const pinoHttp = require('pino-http');
const logger = require('../utils/logger');

const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.id || require('crypto').randomUUID(),
  customSuccessMessage: (res) => `request completed ${res.statusCode}`,
  customErrorMessage: (req, err) => `request error ${err.message}`,
});

module.exports = requestLogger;
