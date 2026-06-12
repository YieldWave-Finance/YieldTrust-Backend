# Description
The `contracts/grant_stream/src/reentrancy.rs` module provides a reusable guard, but the repository may not consistently apply it to all cross-contract entrypoints in grant stream logic.

# Impact
Incomplete guard coverage can leave some entrypoints vulnerable to reentrancy or nested call anomalies, which can compromise fund flows or contract invariants.

# Step-by-Step Implementation Guide
1. Review `contracts/grant_stream/src/lib.rs` and identify all public entrypoints that perform cross-contract or state-modifying calls.
2. Wrap critical functions with `nonreentrant!(env, { ... })` or explicit `reentrancy_enter` / `reentrancy_exit` calls.
3. Add tests that simulate nested guard failures where applicable.
4. Document the recommended guard usage pattern in the `reentrancy.rs` file.
5. Confirm existing test coverage includes guard semantics.

# Resources/References
- Reentrancy guard design patterns
- Soroban transaction atomicity documentation