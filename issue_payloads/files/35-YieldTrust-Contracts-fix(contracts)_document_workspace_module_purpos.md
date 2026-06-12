# Description
The `YieldTrust-Contracts` workspace includes multiple contract members, but the root workspace README and `Cargo.toml` do not clearly document the role of each package or dependency version constraints.

# Impact
New contributors may struggle to understand the repo structure, and dependency drift can create subtle build problems across workspaces.

# Step-by-Step Implementation Guide
1. Update the root `Cargo.toml` workspace section with comments or documentation on which contract packages exist.
2. Add a short section in `YieldTrust-Contracts/README.md` explaining the `grant_stream`, `vesting_contracts`, `arbitration`, `compliance`, and `zk_kyc` members.
3. Review `soroban-sdk` dependency declarations and align version requirements consistently.
4. Add a workspace maintenance note describing how to update shared dependency versions.
5. Verify the workspace builds cleanly after documentation updates.

# Resources/References
- Cargo workspace documentation: https://doc.rust-lang.org/cargo/reference/workspaces.html
- Monorepo dependency management best practices