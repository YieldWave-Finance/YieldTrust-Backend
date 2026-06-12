# Description
The frontend currently renders the default Next.js starter page in `app/page.tsx`. It does not reflect YieldTrust branding, escrow state, or any real user workflow.

# Impact
This makes the frontend unusable as a real dashboard and hides the true state of the project from contributors and users. It also undermines user confidence in the application.

# Step-by-Step Implementation Guide
1. Replace `app/page.tsx` with a dashboard shell that includes a header, summary cards, and a placeholder escrow table.
2. Add semantic sections for `Active Grants`, `Escrow Status`, and `Legal Hold` states.
3. Use Tailwind CSS utility classes to make the layout responsive.
4. Keep the home page lightweight and ready for API integration.
5. Add a short introduction to YieldTrust and the expected user workflow.

# Resources/References
- Next.js app router documentation: https://nextjs.org/docs/app/building-your-application/routing
- Dashboard UI patterns