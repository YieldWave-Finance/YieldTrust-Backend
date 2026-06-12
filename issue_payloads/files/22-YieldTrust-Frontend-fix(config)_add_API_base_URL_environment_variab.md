# Description
The frontend currently has no mechanism for configuring the backend API base URL via environment variables. This prevents deployment across different environments.

# Impact
Hard-coded API endpoints or missing configuration makes the frontend difficult to deploy to staging and production. It also prevents secure separation of environments.

# Step-by-Step Implementation Guide
1. Add a `NEXT_PUBLIC_API_BASE_URL` environment variable usage in `lib/api.ts` or equivalent.
2. Update `next.config.ts` if needed to expose runtime configuration.
3. Document the variable in a `.env.example` file.
4. Use the base URL in fetch requests for escrow and grant data.
5. Add a local development fallback for `http://localhost:3000`.

# Resources/References
- Next.js runtime configuration: https://nextjs.org/docs/app/building-your-application/configuring-global-css
- Environment variable patterns for React