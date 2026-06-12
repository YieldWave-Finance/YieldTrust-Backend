# Description
`contracts/admin/dead_mans_switch.rs` currently uses `panic!` for authorization and state validation failures. These panic conditions should be expressed as contract errors instead.

# Impact
Panics in contract code can cause unclear failure modes and complicate client-side error handling. Contract errors are safer and more auditable in Soroban.

# Step-by-Step Implementation Guide
1. Add a `#[contracterror]` enum for the dead man’s switch contract if not already present.
2. Replace `panic!` and `expect()` calls with error returns in `claim_admin`, `get_admin`, and assertion helpers.
3. Ensure `initialize` still fails cleanly when called twice.
4. Add tests that assert the correct error variant is returned for unauthorized or invalid recovery attempts.
5. Document the new error semantics in the contract comments.

# Resources/References
- Soroban `#[contracterror]` usage
- Secure failure mode design for smart contracts