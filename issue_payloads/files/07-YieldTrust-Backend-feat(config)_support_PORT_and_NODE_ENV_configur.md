# Description
The backend binds to a hard-coded port `3000` in `index.js` and does not use `NODE_ENV` to control production behavior. This makes deployment inflexible.

# Impact
Hard-coded ports reduce the ability to run the app on hosted platforms or local dev setups. Without `NODE_ENV`, production optimizations and safe middleware choices cannot be toggled correctly.

# Step-by-Step Implementation Guide
1. Modify `YieldTrust-Backend/index.js` to read `process.env.PORT` and fallback to `3000`.
2. Use `process.env.NODE_ENV` to configure development versus production settings.
3. Add `.env.example` documenting required variables such as `PORT`, `NODE_ENV`, and any API keys.
4. Use `dotenv` only in non-production environments to avoid leaking secrets.
5. Add a backend startup log message that prints the resolved port and environment.

# Resources/References
- dotenv usage: https://www.npmjs.com/package/dotenv
- Node environment conventions