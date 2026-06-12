# Description
The backend currently uses `console.log` directly for startup messages and logs errors to the console in the global error handler. This is not sufficient for production observability.

# Impact
Console logs are hard to filter, lack structured metadata, and can leak sensitive information if not managed carefully. Centralized logging improves debuggability and incident response.

# Step-by-Step Implementation Guide
1. Add a logging utility module, such as `pino` or `winston`.
2. Replace `console.log` in `index.js` with structured startup logging.
3. Update the global error handler to log with error context and request metadata.
4. Ensure log output format is JSON-compatible for modern logging platforms.
5. Add unit tests or integration tests to verify error handler logging behavior.

# Resources/References
- Logging best practices: https://12factor.net/logs
- Node structured logging patterns