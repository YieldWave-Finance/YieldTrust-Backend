# Description
The backend `package.json` currently uses broad version ranges and minimal dependency protection. There is no `npm audit` baseline or explicit dependency hygiene workflow.

# Impact
Unpinned dependencies can introduce accidental breaking changes during installs and expose the repo to known security vulnerabilities. This raises maintenance cost and deployment risk.

# Step-by-Step Implementation Guide
1. Review `YieldTrust-Backend/package.json` and remove permissive version ranges that are not intentional.
2. Run `npm install` and commit an updated `package-lock.json` if it is missing or stale.
3. Add an `npm audit` script and document how to refresh the audit baseline.
4. Include dependency vulnerability checks in the backend CI workflow.
5. Consider upgrading `express` and `dotenv` to supported stable versions if needed.

# Resources/References
- npm audit docs: https://docs.npmjs.com/cli/v10/commands/npm-audit
- Node.js dependency pinning best practices