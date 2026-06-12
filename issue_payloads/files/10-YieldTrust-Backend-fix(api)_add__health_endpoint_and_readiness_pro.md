# Description
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
- API health endpoint patterns