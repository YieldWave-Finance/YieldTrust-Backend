# Description
The contracts `contracts/compliance/src/lib.rs` and `contracts/zk_kyc/src/lib.rs` use `.unwrap()` when reading stored addresses from contract storage. This can cause panics and fail the contract in ways that are not mapped to user-facing contract errors.

# Impact
Contract panics represent uncontrolled failure modes and can disrupt user experience. Safe error handling makes the contract behavior predictable and easier to audit.

# Step-by-Step Implementation Guide
1. Open `contracts/compliance/src/lib.rs` and `contracts/zk_kyc/src/lib.rs`.
2. Replace `.unwrap()` calls on `env.storage().instance().get(...)` with error handling that returns a defined contract error variant.
3. Add `NotInitialized` or `NotAuthorized` error codes as appropriate in each contract.
4. Update tests to verify the contract returns errors instead of panicking when storage keys are missing.
5. Add comments explaining the safe storage access semantics.

# Resources/References
- Soroban storage best practices
- Rust error handling patterns for contracts