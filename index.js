if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

// --- Core middleware ---
app.use(express.json());

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
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Grant API running on port ${PORT} in ${NODE_ENV} mode`)
);

module.exports = app; // export for testing
