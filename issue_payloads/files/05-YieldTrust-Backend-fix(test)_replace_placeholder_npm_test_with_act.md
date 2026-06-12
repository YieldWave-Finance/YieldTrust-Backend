# Description
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
- Jest API testing patterns