# Description
The frontend currently imports static images via plain `img` tags and does not use Next.js image optimization in the starter page.

# Impact
This can lead to larger bundle sizes, slower page loads, and suboptimal performance on mobile devices.

# Step-by-Step Implementation Guide
1. Replace static image tags with the Next.js `Image` component where appropriate.
2. Ensure `app/page.tsx` uses local assets or optimized remote sources.
3. Add width/height attributes for images to avoid layout shift.
4. Test performance with Lighthouse and verify the asset optimization benefits.
5. Remove any unused static assets from `public/` if they are no longer needed.

# Resources/References
- Next.js Image component docs: https://nextjs.org/docs/app/api-reference/components/image
- Web performance optimization guides