# Description
The escrow routes in `src/routes/escrow.js` currently respond with placeholder success messages and only include TODO comments where on-chain logic belongs. The API cannot perform real escrow flows as written.

# Impact
Leaving these endpoints as stubs means the backend is non-functional for real usage, prevents integration with frontend and smart contract systems, and misrepresents the backend as production-ready.

# Step-by-Step Implementation Guide
1. Inspect `src/middleware/legalHoldGate.js` and ensure `req.escrow` is available after validation.
2. Replace the TODO stubs in `src/routes/escrow.js` with real transaction submission logic.
3. Add a new service layer for calling `onChainAdapter.getEscrow`, funding, releasing, and withdrawing via the contract adapter.
4. Implement robust error handling for transaction failures and return structured JSON payloads.
5. Add example requests to `README.md` documenting the escrow POST endpoints.

# Resources/References
- Express route design: https://expressjs.com/en/guide/routing.html
- Soroban contract invocation patterns via Stellar SDK