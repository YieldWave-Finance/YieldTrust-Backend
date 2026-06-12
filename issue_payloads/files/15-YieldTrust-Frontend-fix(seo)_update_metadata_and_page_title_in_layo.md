# Description
The frontend metadata in `app/layout.tsx` still uses the default Next.js generated title and description. This is misleading and harms SEO.

# Impact
Default placeholder metadata reduces discoverability and gives the impression the app is incomplete. Accurate metadata helps users understand the application at a glance.

# Step-by-Step Implementation Guide
1. Open `YieldTrust-Frontend/app/layout.tsx`.
2. Update `metadata.title` to `YieldTrust Dashboard` or a similar brand name.
3. Update `metadata.description` to describe the YieldTrust escrow and grant dashboard.
4. Add additional metadata fields if needed such as `viewport` and `theme-color`.
5. Validate the app renders the updated metadata in the browser head.

# Resources/References
- Next.js metadata support: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- SEO best practices for React apps