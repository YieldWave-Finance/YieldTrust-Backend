# Description
The frontend workflow currently only runs `npm ci` and `npm run build` without linting or type checking. This misses basic static validation.

# Impact
Missing lint and type checks can allow inconsistent code, type errors, or style issues to reach the main branch. It also reduces maintainability.

# Step-by-Step Implementation Guide
1. Update `.github/workflows/test.yml` for `YieldTrust-Frontend`.
2. Add steps for `npm ci`, `npm run lint`, and `npm run build`.
3. If needed, add `npm run type-check` or `npm exec tsc --noEmit`.
4. Ensure failures in lint or build stop the workflow.
5. Add a `lint` script to `package.json` if not present or extend it to include Tailwind config validation.

# Resources/References
- Next.js CI patterns: https://nextjs.org/docs/deployment
- GitHub Actions for JavaScript projects