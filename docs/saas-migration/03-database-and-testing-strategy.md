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

**What to use real:**
- MongoDB operations
- Repository functions
- Service layer logic
- Business rules

**What to mock:**
- GitHub API calls
- Anthropic API calls
- Stripe API calls

---

## Test Database Setup

### Per-Test-File Isolation
Each test file gets a unique database:

1. **Before all tests in file:**
   - Connect to MongoDB
   - Create database with unique name (e.g., `codewiki_test_<timestamp>_<random>`)
   - Pass connection to tests

2. **After all tests in file:**
   - Drop the database
   - Close connection

### Connection Management
- Single MongoDB instance for all tests
- Separate database per test file
- Connection pooling for performance

### Environment Setup
- `MONGODB_TEST_URI` environment variable
- Default to `mongodb://localhost:27017`
- CI uses MongoDB service container

---

## Mock Strategy

### GitHub Mock

**Approach:** Simple fixture-based mock

**Fixtures needed:**
- Repository metadata
- Commit list
- Commit details with files
- File contents
- User profile

**Mock Implementation:**
- Replace `@octokit/rest` client methods
- Return fixture data based on inputs
- Simulate errors when needed

### Anthropic Mock

**Approach:** Pre-written response fixtures

**Fixtures needed:**
- Code analysis responses
- Documentation generation responses
- Index generation responses
- Guide generation responses
- Context research responses

**Mock Implementation:**
- Replace ClaudeClient.sendMessage
- Match prompt patterns to fixture responses
- Track calls for assertions

### Stripe Mock

**Approach:** Simple success/failure responses

**Fixtures needed:**
- Customer creation response
- Subscription creation response
- Webhook payloads

**Mock Implementation:**
- Replace Stripe client methods
- Return success responses by default
- Simulate webhook events

---

## Test Layers

### Layer 1: Pure Function Unit Tests
- Input/output transformations
- No database, no external calls
- Millisecond execution time
- Example: prompt generation, response parsing, validation

### Layer 2: Repository Unit Tests
- Test CRUD operations against real MongoDB
- Verify indexes work correctly
- Test query patterns
- Example: create user, find by github ID, update plan

### Layer 3: Service Integration Tests
- Full service workflows
- Real database + mocked external APIs
- Test business logic end-to-end
- Example: connect repo, sync commits, verify data state

### Layer 4: API Integration Tests
- HTTP request/response testing
- Real database + mocked external APIs
- Test authentication, authorization
- Example: POST /api/repositories, verify 201 response

### Layer 5: E2E Tests (Playwright)
- Full application running
- Real database + mocked external APIs
- Browser interactions
- Example: login flow, connect repo, view wiki

---

## Test Organization

```
tests/
  fixtures/
    github/
      repo-metadata.json
      commits.json
      commit-details.json
    anthropic/
      code-analysis-response.json
      documentation-response.json
    stripe/
      customer.json
      subscription.json
  helpers/
    db.js              # Database setup/teardown utilities
    mocks.js           # Mock implementations
    fixtures.js        # Fixture loading utilities
    factories.js       # Test data factories
  unit/
    lib/
      utils/           # Pure function tests
      agents/          # Agent unit tests (mocked LLM)
  integration/
    repositories/      # Database repository tests
    services/          # Service layer tests
    api/               # API endpoint tests
  e2e/
    auth.spec.js       # Authentication flows
    repos.spec.js      # Repository management
    wiki.spec.js       # Wiki generation/viewing
```

---

## TDD Workflow

### Iteration Pattern
1. Write failing test describing desired behavior
2. Run test (verify it fails for right reason)
3. Write minimal implementation to pass
4. Run test (verify it passes)
5. Refactor if needed
6. Run test (verify still passes)
7. Commit

### Test-First Rules
- No production code without a failing test
- Test describes behavior, not implementation
- One assertion per test (prefer, not absolute)
- Tests are documentation

---

## Database Testing Utilities

### Factory Functions
Create test data with sensible defaults:

- `createUser(overrides)` - Creates user with defaults
- `createRepository(userId, overrides)` - Creates repo
- `createCommit(repoId, overrides)` - Creates commit
- `createJob(repoId, overrides)` - Creates job
- `createWiki(repoId, overrides)` - Creates wiki
- `createPage(wikiId, overrides)` - Creates page

### Cleanup Helpers
- `clearCollection(name)` - Remove all documents
- `dropDatabase()` - Drop entire test database
- `resetSequences()` - Reset any counters

### Query Helpers
- `findUserByGithubId(id)` - Common query pattern
- `findPendingJobs()` - Find pending jobs
- `findWikiPages(wikiId)` - Get all pages

---

## CI/CD Testing Configuration

### GitHub Actions Setup
- MongoDB service container
- Environment variables for test database
- Parallel test execution
- Coverage reporting

### Test Commands
- `npm test` - All unit tests
- `npm run test:integration` - Integration tests
- `npm run test:e2e` - Playwright E2E tests
- `npm run test:coverage` - With coverage report

### Performance Targets
- Unit tests: < 30 seconds total
- Integration tests: < 2 minutes total
- E2E tests: < 5 minutes total

---

## Migration from Current Testing

### Keep
- Jest configuration
- Playwright configuration
- Existing agent unit tests (update mocking)
- E2E smoke test structure

### Update
- Test setup to handle MongoDB
- Mock approach (inject vs patch)
- Test organization (add integration layer)

### Add
- Database test utilities
- Fixture loading system
- Factory functions
- Integration test suite
- API endpoint tests

### Remove
- File-based state testing
- Tests for removed frontend features
- Tests for removed routes

---

## Open Questions

1. **Test database location for CI?**
   - GitHub Actions MongoDB service
   - Or MongoDB Atlas free tier for CI

2. **Fixture management strategy?**
   - JSON files in fixtures/
   - Or factory functions generating data

3. **Test data seeding for E2E?**
   - API calls to seed data
   - Or direct database insertion

4. **Coverage thresholds?**
   - Aim for 80% overall
   - Higher for critical paths (auth, billing)

5. **Performance testing?**
   - Not for MVP
   - Add when scaling concerns arise
