# Description
The backend currently accepts arbitrary JSON payloads through `express.json()` without size limits or sanitization. This can expose the server to denial-of-service or malformed input attacks.

# Impact
Large request bodies can exhaust memory or CPU resources, and unvalidated JSON can allow surprising data structures to flow into application logic. This weakens security and reliability.

# Step-by-Step Implementation Guide
1. Configure `express.json({ limit: '10kb' })` or a similar safe limit in `index.js`.
2. Add request validation for expected body shapes on escrow POST endpoints.
3. Normalize input values before passing them to service functions.
4. Add tests to verify large or malformed payloads are rejected with `413 Payload Too Large` or `400 Bad Request`.
5. Update backend documentation to describe accepted payload formats.

# Resources/References
- Express body parser limits: https://expressjs.com/en/api.html#express.json
- OWASP secure coding guidelines