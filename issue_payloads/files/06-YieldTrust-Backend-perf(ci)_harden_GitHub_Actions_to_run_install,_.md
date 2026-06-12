# Description
The backend CI workflow only runs `npm ci` and `npm test` against a placeholder script. It does not validate linting, style, or actual test execution.

# Impact
This results in weak automation coverage and can allow broken or poorly styled code to merge. It also fails to catch dependency or build issues before deployment.

# Step-by-Step Implementation Guide
1. Update `.github/workflows/test.yml` for `YieldTrust-Backend`.
2. Add a lint step using ESLint or Node-friendly linting tooling.
3. Ensure `npm ci` and `npm test` run successfully in the workflow.
4. Add a build or static analysis step if applicable.
5. Document the CI requirements in the repository README.

# Resources/References
- GitHub Actions Node setup: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- ESLint CI patterns