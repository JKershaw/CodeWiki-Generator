# CodeWiki SaaS Implementation Roadmap

## Guiding Principles

- **Test-Driven Development** - Write test first, then implement
- **API tests are primary** - Comprehensive API coverage, selective unit tests
- **E2E for user flows** - Every happy path + one of each error type
- **Real database in tests** - Mock only GitHub, Anthropic, Stripe
- **Clean code throughout** - Cleanup before and after, simple abstractions

---

## Phase 0: Preparation

- [ ] Install MongoDB locally (or Docker)
- [ ] Update `.env.example` with MongoDB URI
- [ ] Verify current tests pass (`npm test`)

**Deliverable:** Development environment ready

---

## Phase 1: Test Infrastructure

### Database Setup
- [ ] Database connection/disconnection utility
- [ ] Per-test-file database isolation (create/drop)
- [ ] Basic factory functions (user, repository, wiki, page)

### External API Mocks
- [ ] GitHub mock (repo metadata, commits, user profile)
- [ ] Anthropic mock (LLM responses per agent type)
- [ ] Stripe mock (customer, subscription, webhooks)
- [ ] Store fixtures as JSON files

### Jest Configuration
- [ ] Configure for API tests
- [ ] Database setup/teardown hooks
- [ ] Verify existing tests still pass

**Deliverable:** Test infrastructure supports real MongoDB + mocked external APIs

---

## Phase 2: Frontend Removal & Initial Cleanup

### Remove Frontend
- [ ] Delete views: dashboard, wiki-page, wiki-editor, analytics, planning, projects
- [ ] Delete public assets: CSS and JS files
- [ ] Keep views/error.ejs (simplify it)

### Remove Backend Components
- [ ] Delete: dashboard-controller, planning-manager, suggestion-engine, activity-event-emitter, wiki-analytics
- [ ] Remove corresponding routes from server.js
- [ ] Keep: health endpoint, MCP-related routes

### Create Minimal Frontend
- [ ] Create minimal index.ejs (blank page with title)
- [ ] E2E test: home page loads
- [ ] E2E test: /health returns 200

### Initial Code Cleanup
- [ ] Remove dead code and unused imports
- [ ] Delete orphaned test files
- [ ] Consolidate config into single module
- [ ] Flatten unnecessary directory nesting
- [ ] Remove commented-out code
- [ ] Ensure consistent file naming (kebab-case)

### Verify
- [ ] All remaining tests pass
- [ ] No unused exports in lib/

**Deliverable:** Minimal frontend, clean starting point

---

## Phase 3: Data Layer (MongoDB)

### Models and Repositories
Create repositories with standard CRUD operations:

- [ ] **User** - githubId (unique), username, email, tokens, plan
- [ ] **Repository** - userId, githubRepoId, owner, name, syncStatus
- [ ] **Commit** - repositoryId, sha, message, files, processedAt
- [ ] **Job** - repositoryId, type, status, payload, result, error
- [ ] **Wiki** - repositoryId, userId, name, settings
- [ ] **Page** - wikiId, path, title, content, category, version
- [ ] **PageVersion** - pageId, version, content, commitSha

### Database Management
- [ ] Connection pool configuration
- [ ] Graceful shutdown hook

**Test via API tests** - repositories don't need individual unit tests

**Deliverable:** Complete data layer

---

## Phase 4: Authentication

### GitHub OAuth
- [ ] OAuth redirect URL generation
- [ ] Callback token exchange (mock GitHub)
- [ ] User profile fetch (mock GitHub)
- [ ] Create/update user on login

### Session Management
- [ ] Session creation with httpOnly cookie
- [ ] Session validation middleware
- [ ] Logout endpoint

### API Auth
- [ ] Authentication middleware for API routes
- [ ] 401 response for unauthenticated requests
- [ ] User context injection

### Authorization
- [ ] Repository ownership check
- [ ] Wiki ownership check

### API Tests (comprehensive)
- [ ] All auth endpoints
- [ ] Protected routes require auth
- [ ] Users can only access own resources

### E2E Tests
- [ ] Login happy path
- [ ] Auth error (invalid credentials)

**Deliverable:** Complete auth system

---

## Phase 5: Repository Management

### Services
- [ ] List user's GitHub repositories (mock GitHub)
- [ ] Connect repository (create DB record + initial sync)
- [ ] Sync commits from GitHub
- [ ] Idempotent connection handling

### API Endpoints
- [ ] GET /api/repositories - list user's repos
- [ ] POST /api/repositories - connect repo
- [ ] DELETE /api/repositories/:id - disconnect
- [ ] POST /api/repositories/:id/sync - trigger sync

### API Tests (comprehensive)
- [ ] All repository endpoints
- [ ] Sync behavior
- [ ] Error cases

### E2E Tests
- [ ] Connect repository happy path

**Deliverable:** Repository connection and sync

---

## Phase 6: Agent System Refactor

### Extract Pure Utilities
- [ ] isSignificantFile → lib/utils/
- [ ] sanitizeMarkdown → lib/utils/
- [ ] truncateDiff → lib/utils/
- [ ] addCrossLinks → lib/utils/

### Standard Agent Interface
Each agent exports: name, shouldRun(context), execute(input, deps)

### Refactor Agents
- [ ] CodeAnalysisAgent
- [ ] DocumentationWriterAgent
- [ ] WikiIndexAgent
- [ ] GuideGenerationAgent
- [ ] ArchitectureOverviewAgent
- [ ] MetaAnalysisAgent
- [ ] MetaDocumentIngestionAgent
- [ ] SecurityAnalysisAgent
- [ ] TechDebtAnalysisAgent

### Agent Registry
- [ ] Simple object map of agents
- [ ] Interface validation at startup

**Reference:** Consult current project wiki for existing agent behavior

**Deliverable:** All agents conform to standard interface

---

## Phase 7: Job System

### Job Management
- [ ] Create jobs for unprocessed commits
- [ ] Job executor (pick pending, run agents, update status)
- [ ] Simple setInterval loop
- [ ] Graceful shutdown

### API Endpoints
- [ ] GET /api/jobs - list user's jobs
- [ ] GET /api/jobs/:id - job details
- [ ] POST /api/repositories/:id/process - trigger processing

### API Tests (comprehensive)
- [ ] All job endpoints
- [ ] Job state transitions

**Deliverable:** Job queue system

---

## Phase 8: Wiki System

### Wiki Storage
- [ ] Save agent output to Page collection
- [ ] Version history on updates
- [ ] WikiManager MongoDB adapter

### API Endpoints
- [ ] GET /api/wikis - list user's wikis
- [ ] GET /api/wikis/:id/pages - list pages
- [ ] GET /api/wikis/:id/pages/:path - get page content
- [ ] GET /api/wikis/:id/search - text search

### API Tests (comprehensive)
- [ ] All wiki endpoints
- [ ] Search functionality

### E2E Tests
- [ ] View wiki page happy path

**Deliverable:** Wiki storage and retrieval

---

## Phase 9: MCP Integration

### Authentication
- [ ] MCP authentication layer (session/token)
- [ ] User context for MCP requests

### Scoped Access
- [ ] query_wiki uses user's wikis only
- [ ] resources/list returns user's pages only
- [ ] resources/read verifies ownership

### Documentation
- [ ] MCP setup instructions
- [ ] Claude Code integration guide

**Deliverable:** Authenticated MCP access

---

## Phase 10: Final Cleanup & Polish

### Code Quality Review
- [ ] Review all new code for clarity and simplicity
- [ ] Extract repeated patterns into shared utilities
- [ ] Ensure consistent error handling patterns
- [ ] Verify no circular dependencies
- [ ] Check for proper separation of concerns

### Directory Structure
Ensure clean, logical organization:
```
lib/
  adapters/       # External API wrappers (github, anthropic, stripe)
  agents/         # LLM agents with standard interface
  repositories/   # MongoDB data access
  services/       # Business logic
  utils/          # Pure utility functions
  middleware/     # Express middleware
```

### Remove Cruft
- [ ] Delete any remaining unused code
- [ ] Remove TODO comments (convert to issues)
- [ ] Clean up any debug logging
- [ ] Verify no hardcoded values

### Error Handling
- [ ] Consistent error response format
- [ ] Request ID tracking

### Logging
- [ ] Structured JSON logging
- [ ] Request/response logging middleware

### Configuration
- [ ] Startup validation for required env vars
- [ ] Production .env template

### Health Checks
- [ ] Database connection in /health
- [ ] Readiness/liveness probes

### Documentation
- [ ] Update README
- [ ] API documentation
- [ ] Deployment guide

### Deployment
- [ ] Dockerfile
- [ ] docker-compose.yml for local dev
- [ ] Deploy to staging
- [ ] Smoke test

### E2E Error Tests
- [ ] One validation error flow
- [ ] One server error flow
- [ ] One not-found flow

**Deliverable:** Clean, production-ready application

---

## Future (Post-MVP)

- Billing (Stripe subscriptions)
- Public wikis
- GitHub webhooks (automatic sync)
- Real-time updates (WebSocket)

---

## Progress Tracking

- [ ] Phase 0: Preparation
- [ ] Phase 1: Test Infrastructure
- [ ] Phase 2: Frontend Removal & Initial Cleanup
- [ ] Phase 3: Data Layer
- [ ] Phase 4: Authentication
- [ ] Phase 5: Repository Management
- [ ] Phase 6: Agent System Refactor
- [ ] Phase 7: Job System
- [ ] Phase 8: Wiki System
- [ ] Phase 9: MCP Integration
- [ ] Phase 10: Final Cleanup & Polish

---

## Definition of Done

**Per task:** Tests pass, no regressions, committed

**Per phase:** All tasks done, full suite passes, smoke tested
