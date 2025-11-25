# CodeWiki SaaS - MVP Plan

## Vision

**Core Philosophy**: "Code tells you what. Documentation tells you why. History tells you how."

CodeWiki generates wiki documentation from codebases by analyzing git history. The wiki grows organically as commits are processed, capturing concepts, components, and their evolution.

**SaaS Model**: Users connect GitHub repositories, trigger processing, and access generated wikis. AI coding agents (via MCP) can query the wiki for context.

---

## What We're Building (MVP)

### Core Features
1. **GitHub OAuth** - Login with GitHub
2. **Repository Connection** - Connect repos from your GitHub account
3. **Commit Processing** - Analyze commits with LLM agents, generate wiki pages
4. **Wiki Viewing** - Browse generated documentation
5. **MCP Server** - Let Claude Code query the wiki

### Not Building (MVP)
- Billing/subscriptions (free tier only)
- Public wikis (all private)
- GitHub webhooks (manual sync only)
- Real-time updates (polling only)
- Collaborative editing
- Advanced analytics

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Express   │────▶│   MongoDB   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    ▼           ▼
              ┌─────────┐ ┌─────────┐
              │ GitHub  │ │ Claude  │
              │   API   │ │   API   │
              └─────────┘ └─────────┘
```

### Directory Structure
```
src/
  adapters/       # External API wrappers (github, anthropic, stripe)
  agents/         # LLM agents with standard interface
  repositories/   # MongoDB data access
  services/       # Business logic
  utils/          # Pure utility functions
  middleware/     # Express middleware
  routes/         # API routes
tests/
  fixtures/       # Mock API responses
  helpers/        # Test utilities
  api/            # API tests (primary)
  unit/           # Unit tests (selective)
  e2e/            # Playwright tests
```

---

## Data Models

### User
- githubId (unique), username, email
- accessToken, refreshToken (encrypted)
- plan, createdAt, lastLoginAt

### Repository
- userId, githubRepoId, owner, name, fullName
- defaultBranch, isPrivate, syncStatus, lastSyncAt

### Commit
- repositoryId, sha, message, author, files
- processedAt (null = pending)

### Job
- repositoryId, userId, type, status
- priority, payload, result, error
- startedAt, completedAt

### Wiki
- repositoryId, userId, name
- isPublic, settings, pageCount

### Page
- wikiId, path, title, content, category
- metadata, version, sourceFile

### PageVersion
- pageId, version, content, commitSha

---

## Agent System

### Standard Interface
Every agent exports:
- `name` - Unique identifier
- `shouldRun(context)` - Returns boolean
- `execute(input, deps)` - Returns result

### Dependencies Injected
```javascript
{
  llm: ClaudeClient,
  promptManager: PromptManager,
  wikiManager: WikiManager,
  logger: Logger
}
```

### Agent Types

**Analysis Agents** (return structured data):
- CodeAnalysisAgent - Extract concepts from diffs
- SecurityAnalysisAgent - Find security issues
- TechDebtAnalysisAgent - Identify technical debt

**Writer Agents** (return markdown):
- DocumentationWriterAgent - Write page content
- WikiIndexAgent - Generate index page
- GuideGenerationAgent - Create guides
- ArchitectureOverviewAgent - System overview

**Pure Utilities** (no LLM):
- LinkDiscoveryAgent - Find cross-page mentions

### Agent Execution Order
1. CodeAnalysisAgent (extracts concepts)
2. DocumentationWriterAgent (writes pages)
3. WikiIndexAgent (generates index)
4. LinkDiscoveryAgent (adds cross-links)
5. ArchitectureOverviewAgent (updates overview)
6. GuideGenerationAgent (updates guides)

---

## Testing Strategy

### Test Types
- **Unit Tests**: Only where initialization is complex
- **API Tests**: Comprehensive - every endpoint, all scenarios (PRIMARY)
- **E2E Tests**: Every UI happy path + one of each error type

### Database
- Real MongoDB for all tests
- Per-test-file isolation (create/drop database)

### Mocking
Mock only external APIs:
- **GitHub**: Repo metadata, commits, user profile
- **Anthropic**: Pre-written LLM responses
- **Stripe**: Customer, subscription, webhooks

### Manual Tests
Periodically test with real API keys before releases.

---

## Implementation Phases

### Phase 0: Setup
- [ ] Create new repo
- [ ] npm init, install dependencies
- [ ] MongoDB connection utility
- [ ] Jest + Playwright configuration
- [ ] Basic Express server with health endpoint

### Phase 1: Test Infrastructure
- [ ] Database setup/teardown helpers
- [ ] Factory functions (user, repo, wiki, page)
- [ ] External API mocks (GitHub, Anthropic, Stripe)
- [ ] Fixture files for mock responses

### Phase 2: Authentication
- [ ] GitHub OAuth flow
- [ ] Session management (httpOnly cookies)
- [ ] Auth middleware for API routes
- [ ] E2E: Login happy path, auth error

### Phase 3: Repository Management
- [ ] List user's GitHub repos (mocked)
- [ ] Connect repository
- [ ] Sync commits from GitHub
- [ ] API: GET/POST/DELETE /api/repositories
- [ ] E2E: Connect repo happy path

### Phase 4: Agent System
- [ ] Copy prompt templates from prototype
- [ ] Create agent interface
- [ ] Implement agents with dependency injection
- [ ] Agent registry

### Phase 5: Job System
- [ ] Job model and repository
- [ ] Job executor (setInterval loop)
- [ ] Create jobs for unprocessed commits
- [ ] API: GET /api/jobs, POST /api/repositories/:id/process

### Phase 6: Wiki System
- [ ] Save agent output to Pages
- [ ] Version history
- [ ] API: GET /api/wikis, /api/wikis/:id/pages
- [ ] E2E: View wiki page happy path

### Phase 7: MCP Integration
- [ ] MCP authentication layer
- [ ] Scoped wiki access per user
- [ ] query_wiki tool
- [ ] resources/list and resources/read

### Phase 8: Polish
- [ ] Consistent error format
- [ ] Structured JSON logging
- [ ] Config validation at startup
- [ ] Dockerfile, docker-compose
- [ ] E2E: Error flows (auth, validation, server, 404)

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | MongoDB (native driver) | Document store fits wiki data, no ODM magic |
| Auth | GitHub OAuth | Target users are developers |
| Sessions | MongoDB-backed | Persists across restarts |
| Job queue | Simple setInterval | No complex queue library for MVP |
| Rate limiting | Express middleware | Single instance for MVP |
| TypeScript | No (JavaScript + JSDoc) | Focus on functionality first |
| Logging | Structured JSON | Cloud-native from start |

---

## API Endpoints

### Auth
- GET /auth/github - Redirect to GitHub OAuth
- GET /auth/github/callback - OAuth callback
- POST /auth/logout - Destroy session

### Repositories
- GET /api/repositories - List user's connected repos
- POST /api/repositories - Connect new repo
- DELETE /api/repositories/:id - Disconnect repo
- POST /api/repositories/:id/sync - Trigger commit sync
- POST /api/repositories/:id/process - Trigger processing

### Jobs
- GET /api/jobs - List user's jobs
- GET /api/jobs/:id - Job details

### Wikis
- GET /api/wikis - List user's wikis
- GET /api/wikis/:id/pages - List pages
- GET /api/wikis/:id/pages/:path - Get page content
- GET /api/wikis/:id/search - Search pages

### Health
- GET /health - Database connection status

---

## Dependencies

```json
{
  "dependencies": {
    "express": "^5.1.0",
    "mongodb": "^6.0.0",
    "express-session": "^1.18.0",
    "connect-mongo": "^5.0.0",
    "@anthropic-ai/sdk": "^0.70.0",
    "@octokit/rest": "^20.0.0",
    "dotenv": "^16.4.0",
    "pino": "^8.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## Environment Variables

```
# Required
MONGODB_URI=mongodb://localhost:27017/codewiki
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
SESSION_SECRET=...

# Optional
PORT=3000
NODE_ENV=development
```

---

## Success Criteria

- User can login with GitHub
- User can connect a repository
- Processing generates wiki pages
- User can view wiki pages
- MCP server returns wiki context
- All API tests pass
- E2E happy paths work
- Deploys to staging successfully
