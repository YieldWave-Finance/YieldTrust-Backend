# Description
The backend currently exposes escrow endpoints in `index.js` without any structured request validation or robust error handling. This leaves the API open to malformed payloads, inconsistent responses, and potential server crashes when `req.body` or `req.params` are invalid.

# Impact
Without validation, invalid escrow IDs or request bodies can produce undefined behavior, 500 errors, or unexpected state transitions. This erodes API reliability, increases security risk, and makes integration with frontend clients harder.

# Step-by-Step Implementation Guide
1. Open `YieldTrust-Backend/index.js` and refactor route registration into dedicated route modules.
2. Add validation middleware that checks `req.params.escrowId`, `req.body.amount`, and action-specific payload fields.
3. Normalize validation errors into a consistent JSON response shape, such as `{ error: "Invalid request", details: [...] }`.
4. Update service functions to throw typed errors with `statusCode` properties.
5. Ensure all route handlers catch and forward errors through the existing Express error handler.

# Resources/References
- Express middleware patterns: https://expressjs.com/en/guide/using-middleware.html
- OWASP input validation: https://owasp.org/www-project-top-ten/