# Description
The `YieldTrust-Contracts/src/services/escrowRead.js` adapter currently wraps unknown errors and may conceal malformed on-chain responses. The `legal_hold` normalization is overly permissive.

# Impact
Clients may receive a `legal_hold: true` fallback for unexpected adapter failures, masking the real issue and making debugging harder.

# Step-by-Step Implementation Guide
1. Tighten validation in `src/services/escrowRead.js` for the raw payload shape.
2. Throw descriptive service errors when required fields are missing or invalid.
3. Keep `legal_hold` strict and only default it to true when it is intentionally absent from valid contract payloads.
4. Add tests for malformed `balance`, `recipient`, and `legal_hold` values.
5. Update adapter documentation to explain the safe normalization rules.

# Resources/References
- Defensive adapter patterns
- Data normalization best practices