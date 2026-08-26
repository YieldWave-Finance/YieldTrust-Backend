if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');

const {
  jsonBodyParser,
  sanitizeJsonBody,
  jsonErrorHandler
} = require('./src/middleware/jsonSecurity');
const { rateLimit } = require('./src/middleware/rateLimiter');
const { authenticate } = require('./src/middleware/auth');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- Core middleware ---
app.use(requestLogger);
app.use(jsonBodyParser, sanitizeJsonBody);
app.use(rateLimit());

// Public reads stay open; mutating routes require an API key or bearer token.
app.use(authenticate);

// --- Routes ---
app.get('/', (req, res) => {
  res.json({
    project: 'Grant Stream',
    status: 'Tracking Grants',
    contract: 'CD6OGC46OFCV52IJQKEDVKLX5ASA3ZMSTHAAZQIPDSJV6VZ3KUJDEP4D',
  });
});

app.use('/', routes);

// --- 404 catch-all for unknown routes ---
app.use((req, res) => {
  errorResponse(res, {
    status: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: ERROR_CODES.NOT_FOUND,
  });
});

// --- Error handling (must come last) ---
app.use(jsonErrorHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info('Grant API started', {
      port: PORT,
      nodeEnv: NODE_ENV,
    });
  });
}

module.exports = app;
