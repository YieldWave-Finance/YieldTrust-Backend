# Description
The contracts GitHub Actions workflow currently runs `make build` and `make test` but does not enforce formatting or linting through `cargo fmt` or `cargo clippy`.

# Impact
This allows formatting drift and potential Rust clippy warnings to persist. Running these commands in CI improves code quality and prevents style-related merge issues.

# Step-by-Step Implementation Guide
1. Edit `YieldTrust-Contracts/.github/workflows/test.yml`.
2. Add a `cargo fmt -- --check` step after the workspace setup.
3. Add `cargo clippy --all-targets --all-features -- -D warnings` if supported by the repo.
4. Ensure `make build` and `make test` still pass after the new checks.
5. Document the CI requirements for contract contributors.

# Resources/References
- Rust CI best practices
- cargo fmt and cargo clippy documentation