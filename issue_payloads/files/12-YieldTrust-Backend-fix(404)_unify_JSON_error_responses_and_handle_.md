# Description
The backend returns a generic 404 JSON response at the end of `index.js` but does not standardize error payloads for other failure conditions.

# Impact
Inconsistent error responses make it harder for frontend clients and integrations to parse failures. Standardizing error shapes improves developer experience and API reliability.

# Step-by-Step Implementation Guide
1. Define a standard error format such as `{ error: { message, code, details } }`.
2. Update the 404 catch-all in `index.js` to return that format.
3. Update the global error handler to use the same response shape for all server errors.
4. Add structured codes for common failure classes like validation, auth, and external dependency failures.
5. Add tests verifying error payloads from invalid routes and runtime failures.

# Resources/References
- API error response conventions: https://cloud.google.com/apis/design/errors
- REST error handling best practices