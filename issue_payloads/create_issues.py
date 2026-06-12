import os
import json
import random
import subprocess
import time

issues = [
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(api): add structured request validation and error handling for escrow endpoints",
        "body": """# Description
The backend currently exposes escrow endpoints in `index.js` without any structured request validation or robust error handling. This leaves the API open to malformed payloads, inconsistent responses, and potential server crashes when `req.body` or `req.params` are invalid.

# Impact
Without validation, invalid escrow IDs or request bodies can produce undefined behavior, 500 errors, or unexpected state transitions. This erodes API reliability, increases security risk, and makes integration with frontend clients harder.

# Step-by-Step Implementation Guide
1. Open `YieldTrust-Backend/index.js` and refactor route registration into dedicated route modules.
2. Add validation middleware that checks `req.params.escrowId`, `req.body.amount`, and action-specific payload fields.
3. Normalize validation errors into a consistent JSON response shape, such as `{ error: "Invalid request", details: [...] }`.
4. Update service functions to throw typed errors with `statusCode` properties.
5. Ensure all route handlers catch and forward errors through the existing Express error handler.

# Resources/References
- Express middleware patterns: https://expressjs.com/en/guide/using-middleware.html
- OWASP input validation: https://owasp.org/www-project-top-ten/"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(api): implement actual on-chain fund/release/withdraw logic in escrow routes",
        "body": """# Description
The escrow routes in `src/routes/escrow.js` currently respond with placeholder success messages and only include TODO comments where on-chain logic belongs. The API cannot perform real escrow flows as written.

# Impact
Leaving these endpoints as stubs means the backend is non-functional for real usage, prevents integration with frontend and smart contract systems, and misrepresents the backend as production-ready.

# Step-by-Step Implementation Guide
1. Inspect `src/middleware/legalHoldGate.js` and ensure `req.escrow` is available after validation.
2. Replace the TODO stubs in `src/routes/escrow.js` with real transaction submission logic.
3. Add a new service layer for calling `onChainAdapter.getEscrow`, funding, releasing, and withdrawing via the contract adapter.
4. Implement robust error handling for transaction failures and return structured JSON payloads.
5. Add example requests to `README.md` documenting the escrow POST endpoints.

# Resources/References
- Express route design: https://expressjs.com/en/guide/routing.html
- Soroban contract invocation patterns via Stellar SDK"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(auth): add authentication and authorization for escrow state-changing endpoints",
        "body": """# Description
The backend routes for `/escrow/:escrowId/fund`, `/release`, and `/withdraw` do not enforce authentication or authorization. Any client can currently invoke these state-changing operations.

# Impact
This creates a significant security hole where unauthorized calls could trigger contract transactions or expose sensitive escrow behavior. It also prevents role-based access control for grant administrators and participants.

# Step-by-Step Implementation Guide
1. Add authentication middleware to `YieldTrust-Backend/index.js` or `src/routes/escrow.js`.
2. Implement bearer token or API key validation using environment variables and Express middleware.
3. Authorize actions based on roles such as `admin`, `grant_manager`, or escrow owner.
4. Ensure public GET reads remain accessible while POST actions are protected.
5. Add tests verifying unauthorized requests return `401 Unauthorized` or `403 Forbidden`.

# Resources/References
- Express authentication patterns: https://expressjs.com/en/guide/security.html
- API authorization best practices"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(deps): pin dependencies and add npm audit/generate-lockfile hygiene",
        "body": """# Description
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
- Node.js dependency pinning best practices"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(test): replace placeholder npm test with actual route tests and coverage checks",
        "body": """# Description
The backend package test script is currently a placeholder that echoes `ok`. There are no actual route or service tests securing the API behavior.

# Impact
Without tests, regressions will go undetected and developers cannot safely iterate on the backend. It also prevents meaningful CI validation of escrow endpoint behavior.

# Step-by-Step Implementation Guide
1. Install `jest` and `supertest` or another Node testing framework in the backend repo.
2. Add tests covering `GET /`, invalid escrow IDs, and 502 legal hold cases.
3. Add lifecycle tests for the escrow POST endpoints with mocked adapter behavior.
4. Update `package.json` scripts to run the test suite and fail on uncovered code paths.
5. Ensure the backend CI workflow executes the updated test script.

# Resources/References
- SuperTest usage: https://github.com/visionmedia/supertest
- Jest API testing patterns"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "perf(ci): harden GitHub Actions to run install, lint, and tests for backend changes",
        "body": """# Description
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
- ESLint CI patterns"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "feat(config): support PORT and NODE_ENV configuration with secure environment loading",
        "body": """# Description
The backend binds to a hard-coded port `3000` in `index.js` and does not use `NODE_ENV` to control production behavior. This makes deployment inflexible.

# Impact
Hard-coded ports reduce the ability to run the app on hosted platforms or local dev setups. Without `NODE_ENV`, production optimizations and safe middleware choices cannot be toggled correctly.

# Step-by-Step Implementation Guide
1. Modify `YieldTrust-Backend/index.js` to read `process.env.PORT` and fallback to `3000`.
2. Use `process.env.NODE_ENV` to configure development versus production settings.
3. Add `.env.example` documenting required variables such as `PORT`, `NODE_ENV`, and any API keys.
4. Use `dotenv` only in non-production environments to avoid leaking secrets.
5. Add a backend startup log message that prints the resolved port and environment.

# Resources/References
- dotenv usage: https://www.npmjs.com/package/dotenv
- Node environment conventions"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(security): enforce request size limits and sanitize JSON payloads in Express",
        "body": """# Description
The backend currently accepts arbitrary JSON payloads through `express.json()` without size limits or sanitization. This can expose the server to denial-of-service or malformed input attacks.

# Impact
Large request bodies can exhaust memory or CPU resources, and unvalidated JSON can allow surprising data structures to flow into application logic. This weakens security and reliability.

# Step-by-Step Implementation Guide
1. Configure `express.json({ limit: '10kb' })` or a similar safe limit in `index.js`.
2. Add request validation for expected body shapes on escrow POST endpoints.
3. Normalize input values before passing them to service functions.
4. Add tests to verify large or malformed payloads are rejected with `413 Payload Too Large` or `400 Bad Request`.
5. Update backend documentation to describe accepted payload formats.

# Resources/References
- Express body parser limits: https://expressjs.com/en/api.html#express.json
- OWASP secure coding guidelines"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(logs): introduce centralized request and error logging instead of direct console output",
        "body": """# Description
The backend currently uses `console.log` directly for startup messages and logs errors to the console in the global error handler. This is not sufficient for production observability.

# Impact
Console logs are hard to filter, lack structured metadata, and can leak sensitive information if not managed carefully. Centralized logging improves debuggability and incident response.

# Step-by-Step Implementation Guide
1. Add a logging utility module, such as `pino` or `winston`.
2. Replace `console.log` in `index.js` with structured startup logging.
3. Update the global error handler to log with error context and request metadata.
4. Ensure log output format is JSON-compatible for modern logging platforms.
5. Add unit tests or integration tests to verify error handler logging behavior.

# Resources/References
- Logging best practices: https://12factor.net/logs
- Node structured logging patterns"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(api): add /health endpoint and readiness probe for backend deployment",
        "body": """# Description
There is no health or readiness endpoint in the backend. A simple `/health` route would improve deployments and allow containers to signal liveness.

# Impact
Without health checks, orchestrators and load balancers cannot detect unhealthy instances cleanly, which can lead to poor reliability and failed deployments.

# Step-by-Step Implementation Guide
1. Add a new `GET /health` route in `index.js` or a dedicated health router.
2. Return a minimal JSON payload such as `{ status: 'ok', uptime: process.uptime() }`.
3. If the backend depends on external services, add a readiness probe that verifies those dependencies.
4. Document the health route in `README.md`.
5. Use the health endpoint in deployment manifests or cloud service readiness probes.

# Resources/References
- Kubernetes readiness/liveness: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
- API health endpoint patterns"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(code): modularize backend routes and middleware for maintainability",
        "body": """# Description
The backend currently defines routes directly in `index.js`, making it harder to extend as new escrow and grant management endpoints are added.

# Impact
Monolithic route definitions slow development and create tight coupling between middleware, services, and server startup logic. Modularization improves maintainability and testability.

# Step-by-Step Implementation Guide
1. Extract route registration into a dedicated `src/routes` directory.
2. Move middleware like authentication, validation, and error handling into separate modules.
3. In `index.js`, mount routers with `app.use('/escrow', escrowRoutes)`.
4. Ensure route module tests can import the Express router directly.
5. Keep `index.js` minimal to only configure middleware and start the server.

# Resources/References
- Express application structure: https://expressjs.com/en/guide/routing.html
- Modular route design patterns"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "fix(404): unify JSON error responses and handle unknown routes consistently",
        "body": """# Description
The backend returns a generic 404 JSON response at the end of `index.js` but does not standardize error payloads for other failure conditions.

# Impact
Inconsistent error responses make it harder for frontend clients and integrations to parse failures. Standardizing error shapes improves developer experience and API reliability.

# Step-by-Step Implementation Guide
1. Define a standard error format such as `{ error: { message, code, details } }`.
2. Update the 404 catch-all in `index.js` to return that format.
3. Update the global error handler to use the same response shape for all server errors.
4. Add structured codes for common failure classes like validation, auth, and external dependency failures.
5. Add tests verifying error payloads from invalid routes and runtime failures.

# Resources/References
- API error response conventions: https://cloud.google.com/apis/design/errors
- REST error handling best practices"""
    },
    {
        "repo": "YieldTrust-Backend",
        "title": "feat(docs): update backend README with API endpoint examples and configuration details",
        "body": """# Description
The backend README currently describes a generic AgriTrust repository and lacks concrete API examples for the `YieldTrust-Backend` implementation.

# Impact
Poor documentation increases onboarding friction for contributors and integrators. It also makes it harder to understand how the current backend is intended to work.

# Step-by-Step Implementation Guide
1. Revise `YieldTrust-Backend/README.md` to describe the actual repo purpose and architecture.
2. Add example curl commands for `GET /`, `/escrow/:escrowId`, and escrow actions.
3. Document required environment variables like `PORT`, `NODE_ENV`, and `GRANT_STREAM_CONTRACT_ID`.
4. Include setup commands and test instructions for local development.
5. Verify the README is accurate and aligned with the backend code.

# Resources/References
- Good README structure: https://www.makeareadme.com/
- API documentation best practices"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "feat(ui): replace placeholder landing page with actual YieldTrust dashboard skeleton",
        "body": """# Description
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
- Dashboard UI patterns"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "fix(seo): update metadata and page title in layout.tsx for YieldTrust branding",
        "body": """# Description
The frontend metadata in `app/layout.tsx` still uses the default Next.js generated title and description. This is misleading and harms SEO.

# Impact
Default placeholder metadata reduces discoverability and gives the impression the app is incomplete. Accurate metadata helps users understand the application at a glance.

# Step-by-Step Implementation Guide
1. Open `YieldTrust-Frontend/app/layout.tsx`.
2. Update `metadata.title` to `YieldTrust Dashboard` or a similar brand name.
3. Update `metadata.description` to describe the YieldTrust escrow and grant dashboard.
4. Add additional metadata fields if needed such as `viewport` and `theme-color`.
5. Validate the app renders the updated metadata in the browser head.

# Resources/References
- Next.js metadata support: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- SEO best practices for React apps"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "feat(ui): add responsive navigation header and dashboard sections",
        "body": """# Description
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
- Navbar best practices"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "fix(accessibility): use semantic HTML and accessible components in the app shell",
        "body": """# Description
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
- Next.js accessibility recommendations"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "fix(ci): add frontend lint, type-check, and build validation to GitHub Actions",
        "body": """# Description
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
- GitHub Actions for JavaScript projects"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "fix(deps): add package-lock validation and audit frontend dependencies",
        "body": """# Description
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
- JavaScript dependency auditing guidelines"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "feat(state): scaffold API integration and app state for escrow and grant data",
        "body": """# Description
The frontend currently has no state management or API integration scaffold. It only renders static placeholder content.

# Impact
Without state scaffolding, it is impossible to wire the frontend to backend escrow status or contract data. This delays feature delivery and introduces a poor developer experience.

# Step-by-Step Implementation Guide
1. Create a `lib/api.ts` or `services/escrow.ts` file to fetch data from the backend API.
2. Add React hooks or client components that call `fetch` from `app/page.tsx`.
3. Provide a fallback loading and error state UI.
4. Add placeholder typed interfaces for escrow records and grant summaries.
5. Ensure the app is ready to integrate with `YieldTrust-Backend` once the API is implemented.

# Resources/References
- Next.js data fetching in app router: https://nextjs.org/docs/app/building-your-application/data-fetching
- React state management basics"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "fix(test): add component tests for the homepage and core UI elements",
        "body": """# Description
The frontend repository currently includes no tests for the page component or UI structure. This leaves the app untested and brittle.

# Impact
Lack of tests makes refactors riskier and reduces confidence that the UI renders expected content. It also limits contribution velocity.

# Step-by-Step Implementation Guide
1. Add `@testing-library/react` and `@testing-library/jest-dom` as dev dependencies.
2. Create test files for `app/page.tsx` or navigation component behavior.
3. Add assertions for page titles, headings, and dashboard sections.
4. Add a `test` script to `package.json` that runs the suite.
5. Include test execution in the frontend CI workflow.

# Resources/References
- React Testing Library guide: https://testing-library.com/docs/react-testing-library/intro
- Next.js testing patterns"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "fix(config): add API base URL environment variable support",
        "body": """# Description
The frontend currently has no mechanism for configuring the backend API base URL via environment variables. This prevents deployment across different environments.

# Impact
Hard-coded API endpoints or missing configuration makes the frontend difficult to deploy to staging and production. It also prevents secure separation of environments.

# Step-by-Step Implementation Guide
1. Add a `NEXT_PUBLIC_API_BASE_URL` environment variable usage in `lib/api.ts` or equivalent.
2. Update `next.config.ts` if needed to expose runtime configuration.
3. Document the variable in a `.env.example` file.
4. Use the base URL in fetch requests for escrow and grant data.
5. Add a local development fallback for `http://localhost:3000`.

# Resources/References
- Next.js runtime configuration: https://nextjs.org/docs/app/building-your-application/configuring-global-css
- Environment variable patterns for React"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "feat(ui): add a dedicated 404 page and fallback route for unknown paths",
        "body": """# Description
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
- Good 404 UX patterns"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "perf(ui): optimize static asset usage and migrate images to next/image",
        "body": """# Description
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
- Web performance optimization guides"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "feat(content): remove external starter links and add real YieldTrust onboarding copy",
        "body": """# Description
The current homepage contains external links to Vercel and Next.js starter content that are irrelevant to YieldTrust users.

# Impact
This reduces trust in the application and distracts from the actual product value. It also gives a false impression of an unfinished app.

# Step-by-Step Implementation Guide
1. Remove the external `vercel.com` and `nextjs.org` links from `app/page.tsx`.
2. Replace them with YieldTrust onboarding content such as `How it works`, `Get started`, and `Build on Stellar`.
3. Add short explanatory copy that highlights escrow protections, legal hold enforcement, and grant tracking.
4. Keep the page simple and focused on the core use cases.
5. Validate the new copy visually and ensure it aligns with repository branding.

# Resources/References
- Product copywriting best practices
- Landing page design guidelines"""
    },
    {
        "repo": "YieldTrust-Frontend",
        "title": "feat(style): add global theme and dark mode support with Tailwind CSS variables",
        "body": """# Description
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
- Dark mode design patterns"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "fix(contracts): replace unwrap in compliance and zk_kyc contracts with safe error handling",
        "body": """# Description
The contracts `contracts/compliance/src/lib.rs` and `contracts/zk_kyc/src/lib.rs` use `.unwrap()` when reading stored addresses from contract storage. This can cause panics and fail the contract in ways that are not mapped to user-facing contract errors.

# Impact
Contract panics represent uncontrolled failure modes and can disrupt user experience. Safe error handling makes the contract behavior predictable and easier to audit.

# Step-by-Step Implementation Guide
1. Open `contracts/compliance/src/lib.rs` and `contracts/zk_kyc/src/lib.rs`.
2. Replace `.unwrap()` calls on `env.storage().instance().get(...)` with error handling that returns a defined contract error variant.
3. Add `NotInitialized` or `NotAuthorized` error codes as appropriate in each contract.
4. Update tests to verify the contract returns errors instead of panicking when storage keys are missing.
5. Add comments explaining the safe storage access semantics.

# Resources/References
- Soroban storage best practices
- Rust error handling patterns for contracts"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "fix(contracts): remove panic points from dead mans switch and replace with contract errors",
        "body": """# Description
`contracts/admin/dead_mans_switch.rs` currently uses `panic!` for authorization and state validation failures. These panic conditions should be expressed as contract errors instead.

# Impact
Panics in contract code can cause unclear failure modes and complicate client-side error handling. Contract errors are safer and more auditable in Soroban.

# Step-by-Step Implementation Guide
1. Add a `#[contracterror]` enum for the dead man’s switch contract if not already present.
2. Replace `panic!` and `expect()` calls with error returns in `claim_admin`, `get_admin`, and assertion helpers.
3. Ensure `initialize` still fails cleanly when called twice.
4. Add tests that assert the correct error variant is returned for unauthorized or invalid recovery attempts.
5. Document the new error semantics in the contract comments.

# Resources/References
- Soroban `#[contracterror]` usage
- Secure failure mode design for smart contracts"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "fix(api): implement the missing escrow action flows in the backend router stubs",
        "body": """# Description
The contract repo includes backend router stubs in `src/routes/escrow.js` with TODO placeholders for funding, releasing, and withdrawal. These routes must be implemented to complete the escrow workflow.

# Impact
Without these implementations, the backend cannot orchestrate contract actions or enforce legal hold gating. This prevents meaningful end-to-end operation for escrow contracts.

# Step-by-Step Implementation Guide
1. Inspect the existing TODO comments in `src/routes/escrow.js`.
2. Implement service functions that invoke the proper on-chain contract methods.
3. Use `legalHoldGate` middleware to block actions when legal hold is active.
4. Return consistent transaction status responses to clients.
5. Add tests for the completed route implementations.

# Resources/References
- Express route implementation patterns
- Soroban contract invocation examples"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "fix(contracts): require GRANT_STREAM_CONTRACT_ID and fail gracefully if it is unset",
        "body": """# Description
`src/adapters/onChainAdapter.js` currently throws a generic error if `GRANT_STREAM_CONTRACT_ID` is missing and may fail unexpectedly during runtime.

# Impact
A missing contract ID prevents any on-chain interaction and will crash the adapter. Graceful configuration validation helps diagnose deployment issues quickly.

# Step-by-Step Implementation Guide
1. Update `src/adapters/onChainAdapter.js` to validate environment variables at startup.
2. Throw a descriptive error when `GRANT_STREAM_CONTRACT_ID` or `STELLAR_RPC_URL` is unset.
3. Document required environment variables in `README.md` or `.env.example`.
4. Add a runtime check in the backend startup path if the contract adapter is used there.
5. Add tests or startup validation coverage for missing configuration.

# Resources/References
- Environment variable validation patterns
- Robust runtime configuration handling"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "perf(ci): extend contracts CI to run cargo fmt, cargo clippy, and workspace tests",
        "body": """# Description
The contracts GitHub Actions workflow currently runs `make build` and `make test` but does not enforce formatting or linting through `cargo fmt` or `cargo clippy`.

# Impact
This allows formatting drift and potential Rust clippy warnings to persist. Running these commands in CI improves code quality and prevents style-related merge issues.

# Step-by-Step Implementation Guide
1. Edit `YieldTrust-Contracts/.github/workflows/test.yml`.
2. Add a `cargo fmt -- --check` step after the workspace setup.
3. Add `cargo clippy --all-targets --all-features -- -D warnings` if supported by the repo.
4. Ensure `make build` and `make test` still pass after the new checks.
5. Document the CI requirements for contract contributors.

# Resources/References
- Rust CI best practices
- cargo fmt and cargo clippy documentation"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "fix(contracts): convert placeholder src/lib.rs into a valid entrypoint or remove it",
        "body": """# Description
`YieldTrust-Contracts/src/lib.rs` is intentionally empty and appears to be a placeholder. This is confusing for contributors who expect a real integration entry point.

# Impact
A placeholder source file in the repository root can obscure the actual contract layout and can confuse build tooling or package consumers.

# Step-by-Step Implementation Guide
1. Determine whether `src/lib.rs` is needed as an integration entrypoint.
2. If not needed, remove it from the workspace or add a comment clarifying it is intentionally empty.
3. If it is intended to be used, implement a proper module re-export or bootstrap path.
4. Update the README to describe the contract module structure.
5. Run `cargo test` to validate the workspace after the change.

# Resources/References
- Rust workspace layout guidelines
- Soroban contract packaging patterns"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "feat(contracts): expand grant_stream reentrancy guard coverage to all cross-call entrypoints",
        "body": """# Description
The `contracts/grant_stream/src/reentrancy.rs` module provides a reusable guard, but the repository may not consistently apply it to all cross-contract entrypoints in grant stream logic.

# Impact
Incomplete guard coverage can leave some entrypoints vulnerable to reentrancy or nested call anomalies, which can compromise fund flows or contract invariants.

# Step-by-Step Implementation Guide
1. Review `contracts/grant_stream/src/lib.rs` and identify all public entrypoints that perform cross-contract or state-modifying calls.
2. Wrap critical functions with `nonreentrant!(env, { ... })` or explicit `reentrancy_enter` / `reentrancy_exit` calls.
3. Add tests that simulate nested guard failures where applicable.
4. Document the recommended guard usage pattern in the `reentrancy.rs` file.
5. Confirm existing test coverage includes guard semantics.

# Resources/References
- Reentrancy guard design patterns
- Soroban transaction atomicity documentation"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "fix(contracts): add event and recovery assertion tests for dead mans switch contract",
        "body": """# Description
The `dead_mans_switch.rs` contract contains recovery and admin claim logic, but its test coverage may be incomplete for emitted events and inactivity boundary conditions.

# Impact
Insufficient testing for the recovery path can allow regressions in the inactivity countdown or admin transfer logic. Event emission is also important for auditability.

# Step-by-Step Implementation Guide
1. Review `contracts/admin/dead_mans_switch_test.rs` for coverage gaps.
2. Add tests that verify `heartbeat()` updates `LastActivityAt` and emits a heartbeat event.
3. Add tests that verify `claim_admin()` fails before the inactivity period and succeeds after it.
4. Confirm the `RecoveryExecuted` flag is persisted and prevents repeat claims.
5. Document the expected event names and payloads in the contract comments.

# Resources/References
- Soroban event testing patterns
- Smart contract recovery design"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "fix(contracts): document workspace module purpose and keep dependency versions aligned in Cargo.toml",
        "body": """# Description
The `YieldTrust-Contracts` workspace includes multiple contract members, but the root workspace README and `Cargo.toml` do not clearly document the role of each package or dependency version constraints.

# Impact
New contributors may struggle to understand the repo structure, and dependency drift can create subtle build problems across workspaces.

# Step-by-Step Implementation Guide
1. Update the root `Cargo.toml` workspace section with comments or documentation on which contract packages exist.
2. Add a short section in `YieldTrust-Contracts/README.md` explaining the `grant_stream`, `vesting_contracts`, `arbitration`, `compliance`, and `zk_kyc` members.
3. Review `soroban-sdk` dependency declarations and align version requirements consistently.
4. Add a workspace maintenance note describing how to update shared dependency versions.
5. Verify the workspace builds cleanly after documentation updates.

# Resources/References
- Cargo workspace documentation: https://doc.rust-lang.org/cargo/reference/workspaces.html
- Monorepo dependency management best practices"""
    },
    {
        "repo": "YieldTrust-Contracts",
        "title": "fix(contracts): tighten escrow adapter error handling and normalization for malformed on-chain responses",
        "body": """# Description
The `YieldTrust-Contracts/src/services/escrowRead.js` adapter currently wraps unknown errors and may conceal malformed on-chain responses. The `legal_hold` normalization is overly permissive.

# Impact
Clients may receive a `legal_hold: true` fallback for unexpected adapter failures, masking the real issue and making debugging harder.

# Step-by-Step Implementation Guide
1. Tighten validation in `src/services/escrowRead.js` for the raw payload shape.
2. Throw descriptive service errors when required fields are missing or invalid.
3. Keep `legal_hold` strict and only default it to true when it is intentionally absent from valid contract payloads.
4. Add tests for malformed `balance`, `recipient`, and `legal_hold` values.
5. Update adapter documentation to explain the safe normalization rules.

# Resources/References
- Defensive adapter patterns
- Data normalization best practices"""
    }
]

os.makedirs('issue_payloads/files', exist_ok=True)
for i, issue in enumerate(issues, start=1):
    filename = f"issue_payloads/files/{i:02d}-{issue['repo']}-{issue['title'][:48].replace(' ', '_').replace('/', '_').replace(':', '')}.md"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(issue['body'])

with open('issue_payloads/issues.json', 'w', encoding='utf-8') as f:
    json.dump(issues, f, indent=2)

print(f"Created {len(issues)} issue payloads.")
