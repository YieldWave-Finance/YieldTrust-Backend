# Description
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
- Modular route design patterns