# YieldTrust-Backend

Node.js Express API server for the YieldTrust Protocol, providing backend services for trust fund management, milestone verification, and dispute resolution integration.

## 🚀 Key Features
* **Trust Fund Management API:** REST endpoints to create, track, and manage trust funds with yield aggregation.
* **Milestone Verification:** Endpoints to process and verify milestone completion proofs.
* **Dispute & Yield Integrations:** Integrates dispute resolution workflows and monitors treasury yield aggregation.
* **Grant Stream Tracking:** Tracks grant disbursement and fund allocation across multiple contracts.

## 🛠️ Tech Stack
* **Language/Framework:** Node.js / Express
* **Key Dependencies:** `express`, `cors`, `dotenv`
* **Node.js Version:** v18 or higher recommended

## 📦 Getting Started

### Prerequisites
Ensure you have the required toolchains installed:
* Node.js (v18 or higher recommended)
* npm (Node Package Manager)

### Installation & Local Setup
```bash
# Clone the repository
git clone https://github.com/YieldWave-Finance/YieldTrust-Backend.git
cd YieldTrust-Backend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env

# Start the application
npm start
```

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*

# Blockchain Configuration
STELLAR_NETWORK=testnet
STELLAR_CONTRACT_ADDRESS=CD6OGC46OFCV52IJQKEDVKLX5ASA3ZMSTHAAZQIPDSJV6VZ3KUJDEP4D
```

### Configuration Details
- **PORT:** Server listening port (default: 3000)
- **NODE_ENV:** Environment mode (development/production)
- **CORS_ORIGIN:** Allowed CORS origins for cross-origin requests
- **STELLAR_NETWORK:** Blockchain network (testnet/public)
- **STELLAR_CONTRACT_ADDRESS:** Smart contract address for fund management

## 📡 API Endpoints

### 1. Health Check / Project Status
**GET** `/`

Returns the current project status and contract information.

**Response:**
```json
{
  "project": "Grant Stream",
  "status": "Tracking Grants",
  "contract": "CD6OGC46OFCV52IJQKEDVKLX5ASA3ZMSTHAAZQIPDSJV6VZ3KUJDEP4D"
}
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/
```

### 2. Trust Fund Management
**POST** `/api/trust-funds` (Future endpoint)

Create a new trust fund.

**Request Body:**
```json
{
  "name": "Agricultural Grant Fund",
  "totalAmount": 50000,
  "currency": "USD",
  "beneficiary": "0x1234567890abcdef",
  "contractAddress": "CD6OGC46OFCV52IJQKEDVKLX5ASA3ZMSTHAAZQIPDSJV6VZ3KUJDEP4D"
}
```

**Response:**
```json
{
  "id": "fund-001",
  "name": "Agricultural Grant Fund",
  "totalAmount": 50000,
  "status": "active",
  "createdAt": "2026-06-16T12:00:00Z"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/trust-funds \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agricultural Grant Fund",
    "totalAmount": 50000,
    "currency": "USD"
  }'
```

### 3. Milestone Verification
**POST** `/api/milestones/verify` (Future endpoint)

Verify milestone completion and release funds.

**Request Body:**
```json
{
  "fundId": "fund-001",
  "milestoneId": "milestone-001",
  "proofHash": "0xabc123def456..."
}
```

**Response:**
```json
{
  "milestoneId": "milestone-001",
  "verified": true,
  "amountReleased": 10000,
  "transactionHash": "0x1234567890abcdef"
}
```

### 4. Dispute Resolution
**POST** `/api/disputes/create` (Future endpoint)

Create a new dispute case.

**Request Body:**
```json
{
  "fundId": "fund-001",
  "reason": "Milestone not completed as agreed",
  "description": "Detailed dispute description",
  "reportedBy": "0xuser_address"
}
```

**Response:**
```json
{
  "disputeId": "dispute-001",
  "status": "open",
  "createdAt": "2026-06-16T12:00:00Z",
  "resolvedAt": null
}
```

## 🧾 Request Body Handling & Validation

All JSON request bodies are treated as untrusted and validated before use:

- **JSON limit:** Request bodies are parsed with a conservative **10kb** limit (`express.json({ limit: '10kb', strict: true })`). Multipart/form-data is not parsed.
- **Oversized payloads:** Bodies larger than 10kb are rejected with HTTP **413** `{ "error": "Payload too large" }`.
- **Malformed JSON:** Invalid JSON is rejected with HTTP **400** `{ "error": "Invalid JSON payload" }`.
- **Prototype-pollution hardening:** Payloads containing `__proto__`, `prototype`, or `constructor` keys (at any depth) are rejected with HTTP **400** `{ "error": "Forbidden key in JSON payload" }`.
- **No internal leakage:** Error responses never include stack traces, raw request bodies, internal error objects, dependency versions, or filesystem paths.

> **Note:** Only `GET /` is implemented today. The trust-fund, milestone, and dispute endpoints below are documented as future work and do **not** yet exist.

`src/middleware/jsonSecurity.js` exports reusable middleware/helpers (`jsonBodyParser`, `sanitizeJsonBody`, `requireObjectBody`, `jsonErrorHandler`). The app mounts `jsonBodyParser` + `sanitizeJsonBody` globally, so every route gets the 10kb limit and prototype-pollution guard automatically. Future POST routes should additionally mount `requireObjectBody` (or stricter route-specific field validation) on the route. The `app` is exported and only calls `app.listen(...)` when run directly, so it can be imported in tests without opening a port.

## 🔒 Security Best Practices

1. **Environment Variables:** Never commit `.env` files containing sensitive data
2. **CORS:** Configure appropriate CORS origins for production
3. **Rate Limiting:** Implement rate limiting middleware for production deployments
4. **Input Validation:** Always validate and sanitize user inputs
5. **HTTPS:** Use HTTPS in production environments
6. **Contract Verification:** Always verify smart contract addresses before processing transactions

## 🔄 Continuous Integration

The repository uses **GitHub Actions** to enforce code quality on every push and pull request targeting `main`.

### Workflow: `YieldTrust Backend CI`

| Step | Command | Purpose |
|---|---|---|
| Install | `npm ci` | Reproducible, clean dependency install |
| Lint | `npm run lint` | ESLint static analysis (style + error rules) |
| Test | `npm test` | Jest unit/integration tests with supertest |

The workflow runs on **Node.js 22** and uses npm's built-in dependency cache to speed up installs.

### Running CI checks locally

```bash
# Install dependencies
npm ci

# Run the linter (must pass with zero errors before merging)
npm run lint

# Auto-fix lint issues where possible
npm run lint:fix

# Run the test suite
npm test
```

All three steps must pass for a branch to be considered mergeable.

## 📝 Development Guidelines

### Running Tests
```bash
npm test
```

Tests live under `src/__tests__/` and use **Jest** + **supertest**. Add a corresponding `*.test.js` file for every new route or middleware you introduce.

### Code Style
- Use ES6+ syntax (ESLint enforces `no-var`, `prefer-const`, `semi`, single quotes)
- Follow Express.js best practices
- Implement proper error handling
- Use middleware for cross-cutting concerns

## 🤝 Contributing
Contributions are highly welcome. Please ensure your commits are cryptographically signed using GPG or SSH keys. For major structural changes, please open an issue first to discuss your proposal.

## 📄 License
Please refer to the LICENSE file for licensing information.
