# Architectural Decisions and Answers

## Answers to Lead Developer Questions

### 1. Database scaling: When do we split job executor to separate process?

**Recommendation: Single process for MVP**

Split when either:
- Job processing consistently takes >30 seconds (blocking API responsiveness)
- Need horizontal scaling for multiple workers
- Memory usage exceeds single container limits

**Signs to split:**
- API latency increases during heavy processing
- Job backlog growing faster than processing
- Single instance can't keep up with demand

**How to split later:**
- Job executor becomes separate Node process
- Communicates via database (jobs table)
- No code changes needed in core logic
- Just deployment configuration change

---

### 2. Job execution: Serial or parallel agents per commit?

**Recommendation: Serial execution within a commit, parallel commits optional**

Rationale:
- Some agents depend on previous agent output
- DocumentationWriter needs CodeAnalysis output
- Simpler to reason about and debug
- Lower memory usage per job

**Order of agent execution:**
1. CodeAnalysisAgent (extracts concepts)
2. DocumentationWriterAgent (writes pages)
3. MetaDocumentIngestionAgent (processes meta docs)
4. WikiIndexAgent (generates index)
5. LinkDiscoveryAgent (adds cross-links)
6. ArchitectureOverviewAgent (updates overview)
7. GuideGenerationAgent (updates guides)

**Parallel optimization (future):**
- Multiple commits can process in parallel (separate jobs)
- But single commit remains serial
- Requires careful state management

---

### 3. Wiki storage: MongoDB or filesystem?

**Recommendation: MongoDB for SaaS, with filesystem export option**

Rationale for MongoDB:
- Multi-user requires database for access control
- Easier to query, search, aggregate
- Version history built-in
- Scales with users
- Consistent backup/restore

**Filesystem consideration for MCP:**
- MCP server currently reads from filesystem
- Adapt MCP to read from database via WikiManager
- Or: Provide "export to filesystem" feature for local MCP use

**Migration path:**
- WikiManager interface unchanged
- Swap file backend for MongoDB backend
- Agents don't know the difference

---

### 4. Error recovery: Manual retry only, or automatic with backoff?

**Recommendation: Manual retry only for MVP**

Rationale:
- Simpler implementation
- User decides if retry is worthwhile
- Avoids runaway costs from retry loops
- Failed jobs stay in "failed" state

**Future enhancement:**
- Add retry button in job detail view
- Add configurable auto-retry for specific error types
- Network errors: auto-retry with backoff
- LLM errors: manual retry (may be permanent)
- Rate limits: auto-retry with longer delay

---

### 5. Rate limiting: Where to implement?

**Recommendation: Express middleware layer**

Implementation levels:
1. **Express middleware** (primary) - Per IP and per user
2. **Service layer** (secondary) - Business logic limits (e.g., max repos)

**MVP rate limits:**
- Unauthenticated: 10 requests/minute per IP
- Authenticated: 100 requests/minute per user
- Processing triggers: 10/hour per repository

**Why not nginx:**
- MVP likely single instance
- Express rate limiting is sufficient
- Add nginx when multi-instance

**Implementation:**
- Use express-rate-limit package
- Store counters in MongoDB (persists across restarts)
- Different limits for different route groups

---

### 6. TypeScript strictness: Enable all strict flags or gradual adoption?

**Recommendation: Gradual adoption - stay with JavaScript for MVP**

Rationale:
- Current codebase is JavaScript
- TypeScript migration is separate effort
- JSDoc comments provide type hints
- Focus on functionality first

**If migrating to TypeScript:**
- Start with strict: false
- Enable flags one at a time
- Priority flags: noImplicitAny, strictNullChecks
- Full strict after stabilization

**For MVP:**
- Keep JavaScript
- Use JSDoc for documentation
- Add TypeScript in future phase

---

### 7. Testing granularity: How many unit vs integration vs E2E tests?

**Recommendation: API-first with selective unit tests**

**Test types:**
- **Unit tests**: Only where initialization is complex (not everywhere)
- **API tests**: Comprehensive - every endpoint, all scenarios
- **E2E tests**: Every UI happy path + one of each error type

**Rationale:**
- Unit tests only valuable for complex setup logic
- API tests cover most business logic efficiently
- E2E tests verify user flows work end-to-end
- No arbitrary coverage targets - test what matters

**E2E scope:**
- All happy paths (login, connect repo, view wiki, etc.)
- One auth error flow
- One validation error flow
- One server error flow
- One not-found flow

---

### 8. Monitoring: Console logs sufficient or need structured logging from start?

**Recommendation: Structured JSON logging from start**

Rationale:
- Minimal additional effort
- Enables future log aggregation
- Easier debugging in production
- Cloud platforms expect JSON logs

**Implementation:**
- Use pino or winston with JSON format
- Log levels: error, warn, info, debug
- Include: timestamp, request ID, user ID, action
- Development: Pretty print, Production: JSON

**What to log:**
- All API requests (info)
- Authentication events (info)
- Job state changes (info)
- Errors with stack traces (error)
- External API calls (debug)

---

## Additional Architectural Decisions

### Session Storage

**Decision: MongoDB sessions**

Rationale:
- Persists across server restarts
- Supports horizontal scaling later
- Consistent with database-first approach

Alternative considered: Redis
- Faster but adds infrastructure
- Not needed for MVP scale

---

### Configuration Management

**Decision: Environment variables only**

Rationale:
- Twelve-factor app principle
- Works with all deployment platforms
- Secrets stay out of code
- Validation at startup

Implementation:
- Required vars cause startup failure
- Optional vars have sensible defaults
- Type coercion at load time
- Single config module exports all values

---

### API Versioning

**Decision: No versioning for MVP**

Rationale:
- Single client (own frontend)
- Can make breaking changes freely
- Add versioning when public API exists

Future approach:
- URL prefix (/api/v1/)
- Or Accept header versioning
- Deprecation period for breaking changes

---

### CORS Configuration

**Decision: Strict same-origin for MVP**

Rationale:
- Frontend and API same domain
- No CORS needed
- Simpler security model

Future consideration:
- If MCP needs cross-origin: specific origin whitelist
- Never allow * in production

---

### File Upload Handling

**Decision: Not needed for MVP**

Users don't upload files directly.
- Repositories connected via GitHub
- Wiki content generated by agents
- No user file uploads

---

### Background Job Visibility

**Decision: Basic polling-based status**

Implementation:
- Job status endpoint returns current state
- Frontend polls every 5 seconds during processing
- No WebSocket for MVP

Future enhancement:
- WebSocket for real-time updates
- Server-Sent Events as lighter alternative

---

### Data Retention

**Decision: Keep all data for MVP**

No automatic deletion of:
- Old page versions
- Completed jobs
- Processed commits

Future consideration:
- Configurable retention periods
- Archive old versions to cold storage
- GDPR compliance (user data deletion)

---

### Multi-tenancy Model

**Decision: Shared database with user isolation**

All users share same MongoDB database.
Isolation via:
- User ID in every query
- Repository ownership checks
- No cross-user data access

Alternative considered: Database per user
- Too complex for MVP
- Consider for enterprise tier

---

## Technology Stack Summary

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | Node.js 24+ | Current requirement |
| Framework | Express 5 | Current, stable |
| Database | MongoDB | Document store fits wiki data |
| Auth | GitHub OAuth | Target users are developers |
| Testing | Jest + Playwright | Current setup works |
| Logging | JSON to stdout | Cloud-native pattern |
| Sessions | express-session + MongoDB | Persistent, scalable |

---

## What We're NOT Building (MVP Scope)

Explicitly out of scope for MVP:

1. **Public wikis** - All wikis private
2. **Webhooks** - Manual sync only
3. **Billing** - Free tier only
4. **Real-time updates** - Polling only
5. **Collaborative editing** - Single user per wiki
6. **Custom domains** - Standard URLs only
7. **Advanced analytics** - Basic stats only
8. **API rate limiting tiers** - Single limit
9. **Admin dashboard** - CLI for admin tasks
10. **Email notifications** - No email system

Each can be added in future phases with clear scope.
