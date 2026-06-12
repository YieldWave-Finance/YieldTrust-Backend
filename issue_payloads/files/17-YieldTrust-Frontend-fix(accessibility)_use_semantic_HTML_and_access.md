# Description
The current frontend shell uses generic `div`s and lacks proper semantic structure, headings, and accessible button/link markup.

# Impact
This reduces accessibility for keyboard and screen reader users, and prevents the app from meeting inclusive UX standards.

# Step-by-Step Implementation Guide
1. Update `app/page.tsx` to use `header`, `main`, `section`, and `footer` elements where appropriate.
2. Ensure headings follow a logical `h1` -> `h2` hierarchy.
3. Replace decorative links with proper `button` elements or accessible anchor tags.
4. Add `aria-label`s for images and interactive elements.
5. Validate using Lighthouse or an accessibility audit tool.

# Resources/References
- Web accessibility guidelines: https://www.w3.org/WAI/standards-guidelines/
- Next.js accessibility recommendations