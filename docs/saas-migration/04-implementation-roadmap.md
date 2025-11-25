# CodeWiki SaaS Implementation Roadmap

## Overview

This roadmap provides a step-by-step guide for migrating CodeWiki-Generator from a prototype to a SaaS application. Each phase builds on the previous, with clear deliverables and testing requirements.

**Guiding Principles:**
- Test-Driven Development (write test first, then implement)
- Real database for tests, mock only external APIs
- Explicit dependencies (no hidden state)
- Simplicity over abstraction

---

## Phase 0: Preparation (Foundation)

### 0.1 Create Migration Branch
- [ ] Create feature branch for SaaS migration
- [ ] Update CLAUDE.md with migration context
- [ ] Document current test baseline (npm test should pass)

### 0.2 Set Up Documentation Structure
- [ ] Create `docs/saas-migration/` directory
- [ ] Document current state analysis (done)
- [ ] Document target architecture decisions

### 0.3 Prepare Development Environment
- [ ] Install MongoDB locally (or use Docker)
- [ ] Update `.env.example` with new variables
- [ ] Add MongoDB connection string to `.env`

**Deliverable:** Development environment ready, documentation in place

---

## Phase 1: Test Infrastructure

### 1.1 MongoDB Test Setup
- [ ] Write test: Database connection and disconnection
- [ ] Implement: Database connection utility
- [ ] Write test: Create and drop test database
- [ ] Implement: Test database isolation per file
- [ ] Write test: Collection operations (insert, find, update, delete)
- [ ] Implement: Basic collection utilities

### 1.2 Test Helper Utilities
- [ ] Write test: Factory function creates user with defaults
- [ ] Implement: User factory function
- [ ] Write test: Factory function creates repository
- [ ] Implement: Repository factory function
- [ ] Repeat for: Commit, Job, Wiki, Page factories

### 1.3 Mock Infrastructure
- [ ] Create fixture directory structure
- [ ] Add GitHub API fixture files (repo, commits, user)
- [ ] Create GitHub mock implementation
- [ ] Add Anthropic API fixture files (various responses)
- [ ] Create Anthropic mock implementation
- [ ] Write test: Mock returns fixture data correctly
- [ ] Add Stripe API fixture files
- [ ] Create Stripe mock implementation

### 1.4 Update Jest Configuration
- [ ] Configure Jest for integration tests
- [ ] Add test database setup/teardown hooks
- [ ] Configure test file patterns
- [ ] Verify existing tests still pass

**Deliverable:** Test infrastructure supports real database + mocked external APIs

---

## Phase 2: Frontend Simplification

### 2.1 Create Minimal Frontend
- [ ] Write E2E test: Home page loads with blank content
- [ ] Create minimal `views/index.ejs` (blank page with title)
- [ ] Write E2E test: Health endpoint returns 200
- [ ] Verify health endpoint exists (already present)

### 2.2 Remove Existing Frontend Views
- [ ] Remove `views/dashboard.ejs`
- [ ] Remove `views/wiki-page.ejs`
- [ ] Remove `views/wiki-editor.ejs`
- [ ] Remove `views/analytics.ejs`
- [ ] Remove `views/planning.ejs`
- [ ] Remove `views/projects.ejs`
- [ ] Keep `views/error.ejs` (modify to be minimal)

### 2.3 Remove Frontend Assets
- [ ] Remove `/public/style.css`
- [ ] Remove `/public/app.js`
- [ ] Remove `/public/activity-feed.css`
- [ ] Remove `/public/activity-feed.js`
- [ ] Remove `/public/suggestions.css`
- [ ] Remove `/public/suggestions.js`
- [ ] Remove any other static assets

### 2.4 Remove Unused Backend Routes
- [ ] Remove dashboard controller routes
- [ ] Remove wiki viewer routes
- [ ] Remove wiki editor routes
- [ ] Remove analytics routes
- [ ] Remove planning routes
- [ ] Remove suggestions routes
- [ ] Remove activity feed routes (and WebSocket)
- [ ] Keep: health check, essential API routes for MCP

### 2.5 Remove Unused Controllers/Services
- [ ] Remove `lib/dashboard-controller.js`
- [ ] Remove `lib/planning-manager.js`
- [ ] Remove `lib/suggestion-engine.js`
- [ ] Remove `lib/activity-event-emitter.js`
- [ ] Remove `lib/wiki-analytics.js`
- [ ] Update imports throughout codebase

### 2.6 Update Tests
- [ ] Remove tests for deleted components
- [ ] Update E2E smoke test to match new minimal frontend
- [ ] Verify all remaining tests pass

**Deliverable:** Minimal frontend (blank page + health check), reduced codebase

---

## Phase 3: Data Layer (MongoDB)

### 3.1 User Model
- [ ] Write test: Create user with required fields
- [ ] Implement: User repository - create
- [ ] Write test: Find user by GitHub ID
- [ ] Implement: User repository - findByGithubId
- [ ] Write test: Update user fields
- [ ] Implement: User repository - update
- [ ] Write test: User with duplicate GitHub ID fails
- [ ] Implement: Unique index on githubId

### 3.2 Repository Model
- [ ] Write test: Create repository for user
- [ ] Implement: Repository repository - create
- [ ] Write test: Find repositories by user
- [ ] Implement: Repository repository - findByUserId
- [ ] Write test: Find repository by GitHub repo ID
- [ ] Implement: Repository repository - findByGithubRepoId
- [ ] Write test: Update repository sync status
- [ ] Implement: Repository repository - updateSyncStatus

### 3.3 Commit Model
- [ ] Write test: Create commit for repository
- [ ] Implement: Commit repository - create
- [ ] Write test: Find unprocessed commits
- [ ] Implement: Commit repository - findUnprocessed
- [ ] Write test: Mark commit as processed
- [ ] Implement: Commit repository - markProcessed
- [ ] Write test: Bulk insert commits
- [ ] Implement: Commit repository - bulkCreate

### 3.4 Job Model
- [ ] Write test: Create job with status pending
- [ ] Implement: Job repository - create
- [ ] Write test: Find next pending job (by priority, then age)
- [ ] Implement: Job repository - findNextPending
- [ ] Write test: Update job status to running
- [ ] Implement: Job repository - updateStatus
- [ ] Write test: Complete job with result
- [ ] Implement: Job repository - complete
- [ ] Write test: Fail job with error
- [ ] Implement: Job repository - fail

### 3.5 Wiki Model
- [ ] Write test: Create wiki for repository
- [ ] Implement: Wiki repository - create
- [ ] Write test: Find wiki by repository
- [ ] Implement: Wiki repository - findByRepositoryId
- [ ] Write test: Update wiki settings
- [ ] Implement: Wiki repository - updateSettings

### 3.6 Page Model
- [ ] Write test: Create page in wiki
- [ ] Implement: Page repository - create
- [ ] Write test: Find page by path
- [ ] Implement: Page repository - findByPath
- [ ] Write test: Update page content (increment version)
- [ ] Implement: Page repository - update
- [ ] Write test: Find all pages in wiki
- [ ] Implement: Page repository - findByWikiId
- [ ] Write test: Delete page
- [ ] Implement: Page repository - delete

### 3.7 Page Version Model
- [ ] Write test: Create version when page updated
- [ ] Implement: PageVersion repository - create
- [ ] Write test: Find versions for page
- [ ] Implement: PageVersion repository - findByPageId
- [ ] Write test: Get specific version
- [ ] Implement: PageVersion repository - findByVersion

### 3.8 Database Connection Management
- [ ] Write test: Connection pool handles concurrent requests
- [ ] Implement: Connection pool configuration
- [ ] Write test: Graceful shutdown closes connections
- [ ] Implement: Shutdown hook for database

**Deliverable:** Complete data layer with repositories for all models

---

## Phase 4: Authentication

### 4.1 GitHub OAuth Flow
- [ ] Write test: OAuth redirect URL generated correctly
- [ ] Implement: Generate GitHub OAuth URL
- [ ] Write test: OAuth callback exchanges code for tokens
- [ ] Implement: Token exchange (mock GitHub API)
- [ ] Write test: User profile fetched from GitHub
- [ ] Implement: Fetch user profile (mock GitHub API)
- [ ] Write test: New user created on first login
- [ ] Implement: User creation in callback
- [ ] Write test: Existing user updated on login
- [ ] Implement: User update on subsequent logins

### 4.2 Session Management
- [ ] Write test: Session created after successful login
- [ ] Implement: Session creation with httpOnly cookie
- [ ] Write test: Session validated on protected routes
- [ ] Implement: Session validation middleware
- [ ] Write test: Invalid session redirects to login
- [ ] Implement: Session validation error handling
- [ ] Write test: Logout destroys session
- [ ] Implement: Logout endpoint

### 4.3 API Authentication
- [ ] Write test: API route requires authentication
- [ ] Implement: API authentication middleware
- [ ] Write test: Authenticated request includes user context
- [ ] Implement: User context injection
- [ ] Write test: Unauthenticated request returns 401
- [ ] Implement: 401 response handling

### 4.4 Authorization
- [ ] Write test: User can only access own repositories
- [ ] Implement: Repository ownership check
- [ ] Write test: User can only access own wikis
- [ ] Implement: Wiki ownership check
- [ ] Write test: Admin can access all resources (future)
- [ ] Document: Authorization patterns

**Deliverable:** Complete authentication/authorization system

---

## Phase 5: Repository Management

### 5.1 Connect Repository
- [ ] Write test: List user's GitHub repositories (mocked)
- [ ] Implement: GitHub API - list user repos
- [ ] Write test: Connect repository creates database record
- [ ] Implement: Connect repository service
- [ ] Write test: Connect repository syncs initial commits
- [ ] Implement: Initial commit sync
- [ ] Write test: Duplicate connection returns existing record
- [ ] Implement: Idempotent connection handling

### 5.2 Sync Commits
- [ ] Write test: Fetch new commits from GitHub (mocked)
- [ ] Implement: GitHub API - list commits since
- [ ] Write test: New commits stored in database
- [ ] Implement: Commit storage service
- [ ] Write test: Commit with files stored correctly
- [ ] Implement: File data storage
- [ ] Write test: Sync updates repository lastSyncAt
- [ ] Implement: Sync status tracking

### 5.3 Repository API Endpoints
- [ ] Write test: GET /api/repositories returns user's repos
- [ ] Implement: List repositories endpoint
- [ ] Write test: POST /api/repositories connects new repo
- [ ] Implement: Connect repository endpoint
- [ ] Write test: DELETE /api/repositories/:id disconnects repo
- [ ] Implement: Disconnect repository endpoint
- [ ] Write test: POST /api/repositories/:id/sync triggers sync
- [ ] Implement: Manual sync trigger endpoint

### 5.4 Repository CLI Commands
- [ ] Write test: CLI command lists repositories
- [ ] Implement: list-repos CLI command
- [ ] Write test: CLI command connects repository
- [ ] Implement: connect-repo CLI command
- [ ] Write test: CLI command syncs commits
- [ ] Implement: sync-repo CLI command

**Deliverable:** Repository connection and sync functionality

---

## Phase 6: Agent System Refactor

### 6.1 Extract Pure Utilities
- [ ] Write test: isSignificantFile utility works standalone
- [ ] Extract: isSignificantFile to lib/utils/
- [ ] Write test: sanitizeMarkdown utility works standalone
- [ ] Extract: sanitizeMarkdown to lib/utils/
- [ ] Write test: truncateDiff utility works standalone
- [ ] Extract: truncateDiff to lib/utils/
- [ ] Write test: addCrossLinks utility works standalone
- [ ] Extract: addCrossLinks to lib/utils/

### 6.2 Agent Interface Definition
- [ ] Define: AgentContext type
- [ ] Define: AgentInput type
- [ ] Define: AgentOutput type
- [ ] Define: AgentDependencies type
- [ ] Create: Agent interface documentation

### 6.3 Refactor CodeAnalysisAgent
- [ ] Write test: shouldRun returns true for commits with code
- [ ] Implement: shouldRun method
- [ ] Write test: shouldRun returns false for config-only commits
- [ ] Implement: shouldRun filtering logic
- [ ] Write test: execute returns concepts from LLM (mocked)
- [ ] Implement: execute method with injected dependencies
- [ ] Update: Existing unit tests for new interface

### 6.4 Refactor DocumentationWriterAgent
- [ ] Write test: shouldRun returns true when concepts exist
- [ ] Implement: shouldRun method
- [ ] Write test: execute returns markdown content (mocked LLM)
- [ ] Implement: execute method with injected dependencies
- [ ] Update: Existing unit tests

### 6.5 Refactor WikiIndexAgent
- [ ] Write test: shouldRun respects frequency setting
- [ ] Implement: shouldRun method
- [ ] Write test: execute generates index content (mocked LLM)
- [ ] Implement: execute method
- [ ] Update: Existing unit tests

### 6.6 Refactor Remaining Agents
- [ ] Refactor: GuideGenerationAgent (shouldRun + execute)
- [ ] Refactor: ArchitectureOverviewAgent (shouldRun + execute)
- [ ] Refactor: MetaAnalysisAgent (shouldRun + execute)
- [ ] Refactor: MetaDocumentIngestionAgent (shouldRun + execute)
- [ ] Refactor: SecurityAnalysisAgent (shouldRun + execute)
- [ ] Refactor: TechDebtAnalysisAgent (shouldRun + execute)
- [ ] Update: All unit tests

### 6.7 Agent Registry
- [ ] Write test: Registry loads all agents
- [ ] Implement: Agent registry module
- [ ] Write test: Registry validates agent interface
- [ ] Implement: Interface validation
- [ ] Write test: Registry returns agents by name
- [ ] Implement: Lookup functionality

**Deliverable:** All agents conform to standard interface with dependency injection

---

## Phase 7: Job System

### 7.1 Job Creation
- [ ] Write test: Orchestrator creates job for unprocessed commit
- [ ] Implement: Job creation from commit
- [ ] Write test: Job includes correct payload data
- [ ] Implement: Payload construction
- [ ] Write test: Multiple commits create multiple jobs
- [ ] Implement: Batch job creation

### 7.2 Job Executor
- [ ] Write test: Executor picks up pending job
- [ ] Implement: Job picking logic
- [ ] Write test: Executor updates job to running
- [ ] Implement: Status update on start
- [ ] Write test: Executor runs appropriate agents
- [ ] Implement: Agent execution based on job type
- [ ] Write test: Successful job marked completed
- [ ] Implement: Completion handling
- [ ] Write test: Failed job marked failed with error
- [ ] Implement: Error handling

### 7.3 Job Loop
- [ ] Write test: Loop processes jobs sequentially
- [ ] Implement: Simple setInterval loop
- [ ] Write test: Loop handles no pending jobs gracefully
- [ ] Implement: Empty queue handling
- [ ] Write test: Loop stops on shutdown signal
- [ ] Implement: Graceful shutdown

### 7.4 Job API Endpoints
- [ ] Write test: GET /api/jobs returns user's jobs
- [ ] Implement: List jobs endpoint
- [ ] Write test: GET /api/jobs/:id returns job details
- [ ] Implement: Job details endpoint
- [ ] Write test: POST /api/repositories/:id/process triggers jobs
- [ ] Implement: Manual processing trigger
- [ ] Write test: Job status endpoint for polling
- [ ] Implement: Status polling endpoint

**Deliverable:** Complete job queue system

---

## Phase 8: Wiki System

### 8.1 Wiki Storage (MongoDB)
- [ ] Write test: Agent output saves to Page collection
- [ ] Implement: Page creation from agent output
- [ ] Write test: Page update creates version history
- [ ] Implement: Version tracking
- [ ] Write test: Wiki metadata updated on page changes
- [ ] Implement: Metadata aggregation

### 8.2 Wiki Retrieval
- [ ] Write test: Get single page by path
- [ ] Implement: Page retrieval endpoint
- [ ] Write test: Get all pages in wiki
- [ ] Implement: Page list endpoint
- [ ] Write test: Get page version history
- [ ] Implement: Version history endpoint
- [ ] Write test: Search pages by content
- [ ] Implement: Text search functionality

### 8.3 WikiManager Adapter
- [ ] Write test: WikiManager works with MongoDB backend
- [ ] Implement: MongoDB adapter for WikiManager interface
- [ ] Write test: Existing code works with new backend
- [ ] Verify: Agent integration unchanged

### 8.4 Wiki API Endpoints
- [ ] Write test: GET /api/wikis returns user's wikis
- [ ] Implement: List wikis endpoint
- [ ] Write test: GET /api/wikis/:id/pages returns pages
- [ ] Implement: List pages endpoint
- [ ] Write test: GET /api/wikis/:id/pages/:path returns content
- [ ] Implement: Get page endpoint
- [ ] Write test: Search endpoint returns matching pages
- [ ] Implement: Search endpoint

**Deliverable:** Wiki storage and retrieval via database

---

## Phase 9: MCP Integration

### 9.1 MCP Authentication
- [ ] Write test: MCP requires valid session/token
- [ ] Implement: MCP authentication layer
- [ ] Write test: Unauthenticated MCP request fails
- [ ] Implement: Auth error handling
- [ ] Write test: Authenticated request includes user context
- [ ] Implement: User context for MCP

### 9.2 MCP Wiki Access
- [ ] Write test: query_wiki uses user's wikis only
- [ ] Implement: Scoped wiki access
- [ ] Write test: resources/list returns user's wiki pages
- [ ] Implement: Scoped resource listing
- [ ] Write test: resources/read requires wiki ownership
- [ ] Implement: Ownership verification

### 9.3 MCP Configuration
- [ ] Document: MCP setup instructions for users
- [ ] Create: Setup guide for Claude Code integration
- [ ] Test: End-to-end MCP flow with authentication

**Deliverable:** Authenticated MCP server access

---

## Phase 10: Polish and Deploy

### 10.1 Error Handling
- [ ] Review: All error paths have proper handling
- [ ] Implement: Consistent error response format
- [ ] Add: Request ID tracking for debugging
- [ ] Test: Error scenarios return appropriate responses

### 10.2 Logging
- [ ] Implement: Structured JSON logging
- [ ] Add: Request/response logging middleware
- [ ] Add: Job execution logging
- [ ] Configure: Log levels by environment

### 10.3 Configuration Validation
- [ ] Write test: Missing required env vars fails startup
- [ ] Implement: Startup validation
- [ ] Document: All configuration options
- [ ] Create: Production .env template

### 10.4 Health Checks
- [ ] Write test: Health check verifies database connection
- [ ] Implement: Database health in /health
- [ ] Add: Readiness probe endpoint
- [ ] Add: Liveness probe endpoint

### 10.5 Documentation
- [ ] Update: README with new setup instructions
- [ ] Create: API documentation
- [ ] Create: Deployment guide
- [ ] Update: CLAUDE.md for new architecture

### 10.6 Performance Baseline
- [ ] Measure: API response times
- [ ] Measure: Job processing times
- [ ] Document: Performance baseline
- [ ] Identify: Obvious optimization opportunities

### 10.7 Security Review
- [ ] Audit: Authentication implementation
- [ ] Audit: Authorization checks
- [ ] Audit: Input validation
- [ ] Audit: Sensitive data handling
- [ ] Fix: Any identified issues

### 10.8 Deployment
- [ ] Create: Dockerfile
- [ ] Create: docker-compose.yml for local dev
- [ ] Configure: Production environment
- [ ] Deploy: To staging environment
- [ ] Test: Full flow in staging
- [ ] Document: Deployment process

**Deliverable:** Production-ready application

---

## Future Phases (Post-MVP)

### Future: Billing (Stripe)
- Subscription tiers
- Usage tracking
- Payment processing
- Webhook handling

### Future: Public Wikis
- Public/private toggle
- Anonymous read access
- SEO considerations

### Future: Webhooks
- GitHub webhook receiver
- Automatic sync on push
- Event processing queue

### Future: Advanced Features
- Real-time updates (WebSocket)
- Collaborative editing
- Custom domains
- API rate limiting
- Advanced analytics

---

## Progress Tracking

Use this checklist to track overall progress:

- [ ] Phase 0: Preparation
- [ ] Phase 1: Test Infrastructure
- [ ] Phase 2: Frontend Simplification
- [ ] Phase 3: Data Layer
- [ ] Phase 4: Authentication
- [ ] Phase 5: Repository Management
- [ ] Phase 6: Agent System Refactor
- [ ] Phase 7: Job System
- [ ] Phase 8: Wiki System
- [ ] Phase 9: MCP Integration
- [ ] Phase 10: Polish and Deploy

---

## Definition of Done (Per Task)

Each task is complete when:
1. Test written first (TDD)
2. Implementation passes test
3. No regressions (all tests pass)
4. Code reviewed (self or peer)
5. Committed with clear message

Each phase is complete when:
1. All tasks done
2. Full test suite passes
3. Documentation updated
4. Deployed to development environment
5. Smoke tested manually
