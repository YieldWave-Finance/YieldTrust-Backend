# Description
The frontend currently has no state management or API integration scaffold. It only renders static placeholder content.

# Impact
Without state scaffolding, it is impossible to wire the frontend to backend escrow status or contract data. This delays feature delivery and introduces a poor developer experience.

# Step-by-Step Implementation Guide
1. Create a `lib/api.ts` or `services/escrow.ts` file to fetch data from the backend API.
2. Add React hooks or client components that call `fetch` from `app/page.tsx`.
3. Provide a fallback loading and error state UI.
4. Add placeholder typed interfaces for escrow records and grant summaries.
5. Ensure the app is ready to integrate with `YieldTrust-Backend` once the API is implemented.

# Resources/References
- Next.js data fetching in app router: https://nextjs.org/docs/app/building-your-application/data-fetching
- React state management basics