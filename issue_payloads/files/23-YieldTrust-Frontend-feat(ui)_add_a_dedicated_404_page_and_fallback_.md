# Description
The frontend does not currently provide a custom 404 page or fallback route, leaving unknown routes unstyled and unfriendly.

# Impact
Users navigating to invalid paths will see generic browser or Next.js error output instead of a cohesive app experience.

# Step-by-Step Implementation Guide
1. Create `app/not-found.tsx` in the frontend repo.
2. Add a friendly message, back-to-dashboard link, and optional search prompt.
3. Ensure the page uses the app layout and global styles.
4. Test that unknown routes render the custom 404 page.
5. Optionally add a `not-found` helper link in the navigation UI.

# Resources/References
- Next.js `not-found.tsx` behavior: https://nextjs.org/docs/app/api-reference/file-conventions/not-found
- Good 404 UX patterns