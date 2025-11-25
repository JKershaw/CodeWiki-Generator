# Database and Testing Strategy

## Database Design

### Why MongoDB
- Flexible schema for wiki content and metadata
- Good fit for document-heavy application
- Native support for JSON-like data
- Horizontal scaling for future growth
- Free tier available (Atlas) for MVP

### No ODM (Mongoose) for MVP
- Use native MongoDB driver directly
- More control, less magic
- Simpler testing
- TypeScript types provide schema documentation

---

## Data Models

### User
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| githubId | string | GitHub user ID (unique) |
| username | string | GitHub username |
| email | string | GitHub email |
| accessToken | string | Encrypted GitHub OAuth token |
| refreshToken | string | Encrypted refresh token |
| plan | string | 'free' | 'pro' | 'team' |
| stripeCustomerId | string | Stripe customer ID |
| createdAt | Date | Account creation |
| lastLoginAt | Date | Last login timestamp |

### Repository
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| userId | ObjectId | Owner reference |
| githubRepoId | string | GitHub repository ID |
| owner | string | GitHub owner/org |
| name | string | Repository name |
| fullName | string | owner/name |
| defaultBranch | string | main/master |
| isPrivate | boolean | Private repo flag |
| lastSyncAt | Date | Last commit sync |
| syncStatus | string | 'pending' | 'syncing' | 'synced' | 'failed' |
| commitCount | number | Cached commit count |
| settings | object | Repository-specific settings |
| createdAt | Date | When connected |

### Commit
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| repositoryId | ObjectId | Repository reference |
| sha | string | Git commit SHA |
| message | string | Commit message |
| author | object | { name, email, date } |
| files | array | [{ filename, status, patch }] |
| processedAt | Date | When wiki-processed (null = pending) |
| createdAt | Date | When synced |

### Job
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| repositoryId | ObjectId | Repository reference |
| userId | ObjectId | User who triggered |
| type | string | 'process-commit' | 'full-sync' | 'generate-index' |
| status | string | 'pending' | 'running' | 'completed' | 'failed' |
| priority | number | Higher = sooner |
| payload | object | Job-specific data |
| result | object | Job output data |
| error | object | Error details if failed |
| startedAt | Date | When processing started |
| completedAt | Date | When processing finished |
| createdAt | Date | When job created |

### Wiki
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| repositoryId | ObjectId | Repository reference |
| userId | ObjectId | Owner reference |
| name | string | Wiki name |
| isPublic | boolean | Public access flag |
| settings | object | Wiki settings |
| pageCount | number | Cached page count |
| lastUpdatedAt | Date | Last page update |
| createdAt | Date | When created |

### Page
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| wikiId | ObjectId | Wiki reference |
| path | string | e.g., 'concepts/architecture.md' |
| title | string | Page title |
| content | string | Markdown content |
| category | string | 'component' | 'concept' | 'guide' | 'meta' |
| metadata | object | Frontmatter data |
| sourceFile | string | Source code file (if applicable) |
| version | number | Version counter |
| createdAt | Date | When created |
| updatedAt | Date | Last modified |

### PageVersion (for history)
| Field | Type | Notes |
|-------|------|-------|
| _id | ObjectId | Primary key |
| pageId | ObjectId | Page reference |
| version | number | Version number |
| content | string | Content at this version |
| metadata | object | Metadata at this version |
| commitSha | string | Associated commit (if any) |
| createdAt | Date | When this version created |

---

## Indexes

### User
- `{ githubId: 1 }` unique
- `{ email: 1 }`

### Repository
- `{ userId: 1 }`
- `{ githubRepoId: 1 }` unique
- `{ fullName: 1 }`

### Commit
- `{ repositoryId: 1, sha: 1 }` unique
- `{ repositoryId: 1, processedAt: 1 }`

### Job
- `{ status: 1, priority: -1, createdAt: 1 }` (for queue queries)
- `{ repositoryId: 1, status: 1 }`
- `{ userId: 1, createdAt: -1 }`

### Wiki
- `{ repositoryId: 1 }` unique
- `{ userId: 1 }`

### Page
- `{ wikiId: 1, path: 1 }` unique
- `{ wikiId: 1, category: 1 }`
- `{ wikiId: 1, title: 1 }` (for search)

### PageVersion
- `{ pageId: 1, version: -1 }`

---

## Testing Strategy

### Core Principle: Real Database, Mocked External APIs

**Use real:** MongoDB, all internal code
**Mock only:** GitHub API, Anthropic API, Stripe API

---

## Test Types

### 1. Unit Tests (Selective)
Only write unit tests where initialization is complex:
- Agents with intricate setup logic
- Complex data transformations
- Utility functions with edge cases

**Don't unit test:** Simple CRUD, obvious pass-through code, trivial getters/setters.

### 2. API Tests (Comprehensive)
Test every API endpoint thoroughly:
- All HTTP methods and status codes
- Authentication/authorization
- Valid and invalid inputs
- Error responses

This is the primary test layer - covers most business logic.

### 3. E2E Tests (User Flows)
Playwright browser tests covering:
- **Every UI happy path** - Each user flow works end-to-end
- **One of each error type** - Auth failure, validation error, server error, not found

---

## Test Database Setup

Each test file gets isolated database:
- Before: Create `codewiki_test_<random>` database
- After: Drop database

Environment: `MONGODB_TEST_URI` (default: `mongodb://localhost:27017`)

---

## Mock Strategy

### External API Mocks
Simple fixture-based mocks for:
- **GitHub**: Repo metadata, commits, user profile
- **Anthropic**: Pre-written LLM responses per agent type
- **Stripe**: Success responses, webhook payloads

Store fixtures as JSON files, load in tests.

---

## Test Organization

```
tests/
  fixtures/
    github/           # GitHub API responses
    anthropic/        # LLM responses by agent
    stripe/           # Payment responses
  helpers/
    db.js             # Database setup/teardown
    mocks.js          # External API mocks
  api/                # Comprehensive API tests
    auth.test.js
    repositories.test.js
    jobs.test.js
    wikis.test.js
  unit/               # Only complex initialization
    agents/           # Agent-specific tests
  e2e/
    auth.spec.js      # Login/logout flows
    repos.spec.js     # Connect/sync repository
    wiki.spec.js      # View wiki pages
    errors.spec.js    # Error handling flows
```

---

## Test Commands

- `npm test` - All tests (unit + API)
- `npm run test:e2e` - Playwright E2E tests
- `npm run test:api` - API tests only

---

## Manual Integration Tests

Periodically test with real API keys to validate integrations:
- GitHub OAuth flow (real GitHub)
- LLM agent responses (real Anthropic)
- Stripe webhooks (test mode)

Run manually before major releases. Costs money - use sparingly.

---

## CI Configuration

- MongoDB service container in GitHub Actions
- Run API tests first (fast feedback)
- Run E2E tests after API tests pass
