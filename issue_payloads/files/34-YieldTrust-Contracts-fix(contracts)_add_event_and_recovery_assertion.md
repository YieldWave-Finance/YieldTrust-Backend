# Description
The `dead_mans_switch.rs` contract contains recovery and admin claim logic, but its test coverage may be incomplete for emitted events and inactivity boundary conditions.

# Impact
Insufficient testing for the recovery path can allow regressions in the inactivity countdown or admin transfer logic. Event emission is also important for auditability.

# Step-by-Step Implementation Guide
1. Review `contracts/admin/dead_mans_switch_test.rs` for coverage gaps.
2. Add tests that verify `heartbeat()` updates `LastActivityAt` and emits a heartbeat event.
3. Add tests that verify `claim_admin()` fails before the inactivity period and succeeds after it.
4. Confirm the `RecoveryExecuted` flag is persisted and prevents repeat claims.
5. Document the expected event names and payloads in the contract comments.

# Resources/References
- Soroban event testing patterns
- Smart contract recovery design