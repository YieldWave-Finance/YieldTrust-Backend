# Description
The frontend currently lacks any navigation or dashboard structure. `app/page.tsx` only displays placeholder call-to-action links.

# Impact
Without navigation and dashboard sections, users cannot access different areas of the app or understand how the YieldTrust workflow is organized.

# Step-by-Step Implementation Guide
1. Create a responsive navigation bar component in `app/components/Header.tsx` or inside `app/page.tsx`.
2. Add links for `Dashboard`, `Escrow`, `Grants`, and `Settings`.
3. Use Tailwind CSS to ensure the header collapses cleanly on mobile devices.
4. Add placeholder dashboard cards for active grants, legal hold status, and treasury analytics.
5. Test the layout at multiple breakpoints to confirm responsiveness.

# Resources/References
- Tailwind responsive design: https://tailwindcss.com/docs/responsive-design
- Navbar best practices