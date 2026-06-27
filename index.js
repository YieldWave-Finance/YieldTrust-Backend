if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');

const {
  jsonBodyParser,
  sanitizeJsonBody,
  jsonErrorHandler
} = require('./src/middleware/jsonSecurity');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- Core middleware ---
// Hardened JSON parsing: 10kb limit, strict mode, prototype-pollution guard.
// Every route declared after this gets the hardening automatically.
app.use(jsonBodyParser, sanitizeJsonBody);

// --- Routes ---
app.get('/', (req, res) => {
  res.json({
    project: 'Grant Stream',
    status: 'Tracking Grants',
    contract: 'CD6OGC46OFCV52IJQKEDVKLX5ASA3ZMSTHAAZQIPDSJV6VZ3KUJDEP4D',
  });
});

app.use('/', routes);

// --- Error handling (must come last) ---
// JSON parser errors first (413/400), then the generic handler for the rest.
app.use(jsonErrorHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`Grant API running on port ${PORT} in ${NODE_ENV} mode`)
  );
}

module.exports = app; // export for testing
