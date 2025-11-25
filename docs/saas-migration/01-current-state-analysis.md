# CodeWiki-Generator: Current State Analysis

## Overview

This document analyzes the existing CodeWiki-Generator prototype to inform the SaaS migration strategy.

---

## Architecture Summary

### Entry Points
- `server.js` - Express web server (port 3000)
- `mcp-server.js` - MCP server for Claude Code integration
- `generate-self-wiki.js` - CLI for wiki generation
- `wiki-context.js` - CLI for context research

### Core Components

| Component | Location | Responsibility |
|-----------|----------|----------------|
| Processor | `lib/processor.js` | Main orchestrator - processes commits, coordinates agents |
| WikiManager | `lib/wiki-manager.js` | Markdown file CRUD operations |
| StateManager | `lib/state-manager.js` | JSON file-based processing state |
| ClaudeClient | `lib/claude.js` | Anthropic API wrapper with cost tracking |
| GitHubClient | `lib/github.js` | GitHub API wrapper |
| Config | `lib/config.js` | Environment-based configuration |
| PromptManager | `lib/prompts.js` | Prompt template loading/rendering |

### Agent Inventory

| Agent | Purpose | LLM Calls |
|-------|---------|-----------|
| CodeAnalysisAgent | Analyzes code diffs to extract concepts | Yes |
| DocumentationWriterAgent | Generates markdown documentation | Yes |
| MetaAnalysisAgent | Periodic progress analysis | Yes |
| MetaDocumentIngestionAgent | Processes Idea.md, Specification.md | Yes |
| WikiIndexAgent | Generates index.md navigation | Yes |
| GuideGenerationAgent | Creates getting-started guides | Yes |
| ArchitectureOverviewAgent | Generates architecture.md | Yes |
| LinkDiscoveryAgent | Finds cross-page link opportunities | No (pure) |
| WikiContextAgent | AI-powered context research | Yes |
| SecurityAnalysisAgent | Security vulnerability detection | Yes |
| TechDebtAnalysisAgent | Technical debt identification | Yes |

### Frontend Components

**Views (EJS Templates):**
- `dashboard.ejs` - Main control panel with processing controls
- `wiki-page.ejs` - Wiki page viewer with markdown rendering
- `wiki-editor.ejs` - Wiki page editor
- `analytics.ejs` - Wiki analytics dashboard
- `planning.ejs` - Task planning interface
- `projects.ejs` - Project management
- `error.ejs` - Error page

**Static Assets (implied from dashboard):**
- `/public/style.css`
- `/public/app.js`
- `/public/activity-feed.css`
- `/public/activity-feed.js`
- `/public/suggestions.css`
- `/public/suggestions.js`

---

## API Routes (Current)

### Dashboard & Control
- `GET /` - Dashboard view
- `GET /api/status` - Processing status
- `POST /process/start` - Start processing
- `POST /process/pause` - Pause processing
- `POST /process/step` - Process single commit
- `POST /process/batch` - Process batch of commits

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects/create` - Create project
- `POST /api/projects/import` - Import project
- `DELETE /api/projects/:project` - Delete project
- `GET /api/projects/:project/settings` - Get settings
- `PUT /api/projects/:project/settings` - Update settings

### Wiki
- `GET /wiki/:project/*` - View wiki page
- `GET /wiki/:project/*/edit` - Edit wiki page
- `POST /wiki/:project/*/save` - Save wiki edit
- `POST /wiki/:project/create` - Create new page
- `GET /api/wiki/:project/search` - Search wiki
- `GET /api/wiki/:project/toc/*` - Table of contents
- `GET /api/wiki/:project/related/*` - Related pages

### Activity & Analytics
- `GET /api/activity/feed` - Activity feed
- `GET /api/activity/history` - Activity history
- `POST /api/activity/clear` - Clear history
- `GET /analytics` - Analytics dashboard
- `GET /api/analytics/:project` - Project analytics

### Planning & Suggestions
- `GET /planning` - Planning view
- `GET /api/planning/:project` - Get tasks
- `POST /api/planning/:project/tasks` - Create task
- `PUT /api/planning/:project/tasks/:id` - Update task
- `DELETE /api/planning/:project/tasks/:id` - Delete task
- `GET /api/suggestions/:project` - Get suggestions
- `POST /api/suggestions/:project/generate` - Generate suggestions
- `POST /api/suggestions/:project/:id/apply` - Apply suggestion
- `DELETE /api/suggestions/:project/:id` - Dismiss suggestion

### Context Research
- `POST /api/context/research` - AI context research

### History
- `GET /api/history/:project/*/statistics` - Page statistics
- `GET /api/history/commit/:project/*` - Commit details
- `GET /api/history/:project/*` - Page history

### Health
- `GET /health` - Health check

---

## Data Storage (Current)

### File-Based Storage
- **Wiki Content**: `./wikis/{project}/**/*.md` - Markdown files with YAML frontmatter
- **Global Metadata**: `./wikis/{project}/_metadata.json` - Page metadata index
- **Project Config**: `./wikis/{project}/_project.json` - Project settings
- **Processing State**: `./state.json` - Current processing progress
- **MCP Metrics**: `./mcp-metrics.json` - MCP server metrics

### State Structure (state.json)
```json
{
  "repoUrl": "https://github.com/owner/repo",
  "totalCommits": 100,
  "currentCommit": 45,
  "lastMetaAnalysis": 40,
  "status": "running|paused|stopped",
  "pagesCreated": 20,
  "pagesUpdated": 15,
  "lastMetaAnalysisResults": {}
}
```

---

## Testing Infrastructure

### Framework
- **Unit/Integration**: Jest
- **E2E**: Playwright

### Test Organization
```
tests/
  setup.js              # Global test setup, mocks
  unit/
    agents/             # Agent unit tests
    *.test.js           # Component unit tests
  integration/
    server.test.js      # API integration tests
    dashboard-routes.test.js
  e2e/
    smoke.spec.js       # Browser smoke tests
    ui-screenshots.spec.js
```

### Current Mocking Strategy
- `process.env.TEST_MODE = 'true'` forces mocks
- Anthropic API mocked with fake key
- GitHub API mocked with fake token
- `marked` library mocked for CommonJS compatibility
- Each agent test mocks ClaudeClient.sendMessage/sendMessageJSON

---

## Agent Architecture (Current Pattern)

Each agent follows this pattern:
```javascript
class SomeAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();  // Creates own instance
    this.promptManager = new PromptManager();
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 3000;
  }

  async mainMethod(input) {
    const prompt = this.promptManager.render('template-name', data);
    const response = await this.claudeClient.sendMessage(prompt, options);
    return this.processResponse(response);
  }
}
```

### Issues with Current Pattern
1. **Hidden Dependencies**: Each agent creates its own ClaudeClient
2. **Difficult Testing**: Must mock ClaudeClient in each test
3. **No Standard Interface**: Methods vary per agent
4. **Tightly Coupled**: Hard to swap implementations
5. **No shouldRun Logic**: Processor decides when to run agents

---

## Processor Orchestration Flow

1. Load/initialize state from file
2. Parse repository URL
3. Fetch all commits from GitHub
4. For each commit:
   a. Check cost limit
   b. Separate files into meta-documents vs code files
   c. Process meta-documents in parallel
   d. Process code files in parallel (analyze -> document)
   e. Update state file
   f. Conditionally run meta-analysis
   g. Conditionally regenerate wiki state (index, links, guides)
5. Generate final wiki artifacts (index, guides, architecture)
6. Return statistics

---

## Dependencies

### Production
- `@anthropic-ai/sdk` - Claude API client
- `@octokit/rest` - GitHub API client
- `express` - Web framework
- `ejs` - Template engine
- `marked` - Markdown parser
- `dotenv` - Environment config
- `simple-git` - Git operations
- `ws` - WebSocket (activity feed)

### Development
- `jest` - Unit testing
- `@playwright/test` - E2E testing
- `supertest` - HTTP testing

---

## Configuration (Environment Variables)

| Variable | Default | Purpose |
|----------|---------|---------|
| ANTHROPIC_API_KEY | (required) | Claude API authentication |
| GITHUB_TOKEN | (optional) | GitHub API authentication |
| PORT | 3000 | Server port |
| WIKI_PATH | ./wiki | Wiki storage path |
| MAX_DAILY_COST | 10 | Cost limit |
| CLAUDE_MODEL | claude-haiku-4-5-20251001 | Default model |
| TEST_MODE | false | Enable test mode |
| Various _FREQUENCY | varies | Agent execution frequencies |

---

## Key Observations for Migration

### What to Keep
- MCP server architecture (needs auth layer)
- Agent prompt templates (lib/prompts/)
- Wiki markdown format with frontmatter
- Cost tracking in ClaudeClient
- Test file organization

### What to Remove
- All EJS views (dashboard.ejs, wiki-page.ejs, etc.)
- Static assets (/public/)
- Dashboard controller
- File-based state management
- Activity feed WebSocket
- Planning manager
- Suggestion engine

### What to Refactor
- Agents to standard interface (name, version, shouldRun, execute)
- Processor to work with jobs/database instead of file state
- Config to validate required env vars at startup
- WikiManager to support MongoDB storage option
- StateManager to use MongoDB

### What to Add
- MongoDB models (User, Repository, Job, Wiki, Page)
- GitHub OAuth authentication
- Job queue system
- API authentication middleware
- Stripe integration
- Rate limiting
- New minimal frontend (blank page + health)

---

## Risk Assessment

### Low Risk
- Removing frontend (well-isolated in views/)
- Adding MongoDB (parallel to existing file storage)
- Adding authentication (middleware pattern)

### Medium Risk
- Agent refactoring (11 agents, need consistent interface)
- Processor refactoring (complex orchestration logic)
- State migration (current state is file-based)

### High Risk
- Breaking existing MCP integration
- Breaking existing tests (220+ tests)
- Data model design (affects everything downstream)
