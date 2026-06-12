# Description
The contract repo includes backend router stubs in `src/routes/escrow.js` with TODO placeholders for funding, releasing, and withdrawal. These routes must be implemented to complete the escrow workflow.

# Impact
Without these implementations, the backend cannot orchestrate contract actions or enforce legal hold gating. This prevents meaningful end-to-end operation for escrow contracts.

# Step-by-Step Implementation Guide
1. Inspect the existing TODO comments in `src/routes/escrow.js`.
2. Implement service functions that invoke the proper on-chain contract methods.
3. Use `legalHoldGate` middleware to block actions when legal hold is active.
4. Return consistent transaction status responses to clients.
5. Add tests for the completed route implementations.

# Resources/References
- Express route implementation patterns
- Soroban contract invocation examples