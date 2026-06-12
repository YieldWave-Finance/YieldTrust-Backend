# Description
The frontend currently has a basic light/dark palette but lacks structured theme token support in `app/globals.css` and the app layout.

# Impact
Without a theme system, consistent styling and future design updates become more difficult. Dark mode support and theme tokens improve maintainability and accessibility.

# Step-by-Step Implementation Guide
1. Enhance `app/globals.css` with color variables and theme utility classes.
2. Use Tailwind theme tokens for background, foreground, and accent colors.
3. Add a dark mode toggle or follow system preferences with `prefers-color-scheme`.
4. Ensure the app layout uses these tokens consistently across components.
5. Document the theme variables in the frontend README.

# Resources/References
- Tailwind CSS theming: https://tailwindcss.com/docs/theme
- Dark mode design patterns