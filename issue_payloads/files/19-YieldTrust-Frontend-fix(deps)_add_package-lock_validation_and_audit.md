# Description
The frontend has a `package.json` but no guarantee that dependencies are audited or locked in a reproducible manner. The repo should enforce package-lock integrity.

# Impact
Uncontrolled frontend dependencies introduce supply chain and build reproducibility issues. This can lead to mismatched runtime behavior across machines.

# Step-by-Step Implementation Guide
1. Verify `YieldTrust-Frontend/package-lock.json` is present and up to date.
2. Add an `npm audit` or `npm ci` check to the frontend workflow.
3. Pin direct dependencies where appropriate and document supported Node versions.
4. Add a `ci` script to run `npm ci && npm run lint && npm run build` locally.
5. Update the README to mention dependency install and audit guidance.

# Resources/References
- npm lockfile best practices
- JavaScript dependency auditing guidelines