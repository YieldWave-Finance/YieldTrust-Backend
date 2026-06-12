# Description
The backend routes for `/escrow/:escrowId/fund`, `/release`, and `/withdraw` do not enforce authentication or authorization. Any client can currently invoke these state-changing operations.

# Impact
This creates a significant security hole where unauthorized calls could trigger contract transactions or expose sensitive escrow behavior. It also prevents role-based access control for grant administrators and participants.

# Step-by-Step Implementation Guide
1. Add authentication middleware to `YieldTrust-Backend/index.js` or `src/routes/escrow.js`.
2. Implement bearer token or API key validation using environment variables and Express middleware.
3. Authorize actions based on roles such as `admin`, `grant_manager`, or escrow owner.
4. Ensure public GET reads remain accessible while POST actions are protected.
5. Add tests verifying unauthorized requests return `401 Unauthorized` or `403 Forbidden`.

# Resources/References
- Express authentication patterns: https://expressjs.com/en/guide/security.html
- API authorization best practices