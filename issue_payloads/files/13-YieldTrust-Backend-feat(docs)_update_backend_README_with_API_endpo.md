# Description
The backend README currently describes a generic AgriTrust repository and lacks concrete API examples for the `YieldTrust-Backend` implementation.

# Impact
Poor documentation increases onboarding friction for contributors and integrators. It also makes it harder to understand how the current backend is intended to work.

# Step-by-Step Implementation Guide
1. Revise `YieldTrust-Backend/README.md` to describe the actual repo purpose and architecture.
2. Add example curl commands for `GET /`, `/escrow/:escrowId`, and escrow actions.
3. Document required environment variables like `PORT`, `NODE_ENV`, and `GRANT_STREAM_CONTRACT_ID`.
4. Include setup commands and test instructions for local development.
5. Verify the README is accurate and aligned with the backend code.

# Resources/References
- Good README structure: https://www.makeareadme.com/
- API documentation best practices