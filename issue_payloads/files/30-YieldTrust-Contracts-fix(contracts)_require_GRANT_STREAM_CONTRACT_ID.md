# Description
`src/adapters/onChainAdapter.js` currently throws a generic error if `GRANT_STREAM_CONTRACT_ID` is missing and may fail unexpectedly during runtime.

# Impact
A missing contract ID prevents any on-chain interaction and will crash the adapter. Graceful configuration validation helps diagnose deployment issues quickly.

# Step-by-Step Implementation Guide
1. Update `src/adapters/onChainAdapter.js` to validate environment variables at startup.
2. Throw a descriptive error when `GRANT_STREAM_CONTRACT_ID` or `STELLAR_RPC_URL` is unset.
3. Document required environment variables in `README.md` or `.env.example`.
4. Add a runtime check in the backend startup path if the contract adapter is used there.
5. Add tests or startup validation coverage for missing configuration.

# Resources/References
- Environment variable validation patterns
- Robust runtime configuration handling