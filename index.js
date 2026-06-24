const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => console.log(`Grant API running on port ${port}`));

module.exports = app; // export for testing
