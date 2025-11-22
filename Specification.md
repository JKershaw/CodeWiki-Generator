# CodeWiki Generator - Technical Specification

## Context & Goals

**Problem**: Understanding large codebases is difficult. Documentation becomes stale, mental models diverge from reality, and onboarding is painful.

**Solution**: An autonomous system that generates and maintains comprehensive wiki documentation by progressively analyzing git history, creating a living knowledge base that evolves with the code.

**Primary Users**: Solo developers and small teams who want automated, high-quality documentation without manual maintenance overhead.

**Success Criteria**:
- Process a 100-commit repository in under 30 minutes
- Generate 15-20 interconnected wiki pages
- Documentation is immediately useful for understanding the codebase
- Cost under $5 per 100 commits (Claude API)
- Can be used via MCP server to provide context to Claude Code

## Non-Goals (v1)

- Real-time/always-on processing
- Multi-repository support
- Team collaboration features
- Custom agent creation UI
- Diagram generation
- Full-text code search
- Authentication/permissions
- Deployment to production servers

## Technical Stack

**Runtime**: Node.js 24.x LTS (https://nodejs.org/)  
**Web Framework**: Express 5.1.0 (https://www.npmjs.com/package/express)  
**Templating**: EJS 3.1.10 (https://www.npmjs.com/package/ejs)  
**GitHub Integration**: Octokit 5.0.5 (https://www.npmjs.com/package/octokit)  
**AI Processing**: Anthropic SDK 0.70.0 (https://www.npmjs.com/package/@anthropic-ai/sdk)  
**Wiki Storage**: Local markdown files (git-friendly)

## Architecture Overview

```
Repository → Git History Walker → AI Agents → Wiki (Markdown)
                    ↓                               ↓
              Dashboard UI ← WebSocket Updates ← Progress
```

The system walks through git commits chronologically, analyzes code changes using Claude, and builds/updates wiki documentation incrementally. A dashboard provides real-time visibility and manual control.

## Core Components

### 1. Dashboard (Express + EJS)
**Purpose**: Human-in-the-loop control interface

**Routes**:
- `GET /` - Main dashboard
- `GET /wiki/:page` - View individual wiki page
- `POST /process/start` - Begin processing
- `POST /process/pause` - Pause processing
- `POST /process/step` - Process single commit
- `GET /api/status` - Current state (JSON)
- WebSocket `/ws` - Real-time updates

**Views** (EJS templates):
- `dashboard.ejs` - Control panel + processing log
- `wiki-page.ejs` - Rendered markdown viewer
- `partials/sidebar.ejs` - Wiki page navigation

### 2. Processor
**Purpose**: Main processing loop

**Key Functions**:
- `processRepository(repoUrl, startCommit)` - Main entry point
- `processCommit(commit)` - Handle single commit
- `runMetaAnalysis()` - Every N commits, analyze themes
- `saveState()` / `loadState()` - Persistence

**Processing Flow**:
```javascript
for each commit:
  1. Fetch commit data (Octokit)
  2. Get changed files
  3. For each file:
     - Determine if significant
     - Get relevant wiki context
     - Call appropriate AI agent
     - Update wiki pages
  4. Broadcast progress via WebSocket
  5. Every 5 commits: trigger meta-analysis
  6. Save state
```

### 3. AI Agents
**Purpose**: Specialized Claude API calls for different tasks

**Code Analysis Agent**:
- Input: File diff, commit message, related wiki pages (≤3)
- Output: JSON with concepts, code elements, relationships
- Model: claude-sonnet-4-20250514
- Max tokens: 2000

**Documentation Writer Agent**:
- Input: Code analysis output, existing page content
- Output: Markdown documentation
- Model: claude-sonnet-4-20250514
- Max tokens: 3000

**Meta-Analysis Agent** (triggered every 5 commits):
- Input: Summary of concepts from last 5 commits, page titles
- Output: JSON with themes, reorganization suggestions, gaps
- Model: claude-sonnet-4-20250514
- Max tokens: 2000

### 4. Wiki Manager
**Purpose**: Read/write markdown files

**Structure**:
```
wiki/
├── concepts/         # High-level abstractions
├── components/       # Classes, modules, services
├── guides/          # How-to documentation
├── index.md         # Entry point
└── _metadata.json   # Page relationships, stats
```

**Page Format** (frontmatter + markdown):
```markdown
---
title: Authentication System
created: 2025-11-22
updated: 2025-11-22
related: [OAuth, UserService, SessionManager]
---

## Overview
[Content here]
```

**Functions**:
- `getPage(title)` - Read markdown + parse frontmatter
- `updatePage(title, content, metadata)` - Write with history
- `getRelatedPages(filePath)` - Find relevant context (≤3 pages)
- `searchPages(keywords)` - Simple keyword search
- `getAllPages()` - List for sidebar

### 5. GitHub Integration
**Purpose**: Access repository data

**Key Operations**:
- `getCommits(owner, repo, { since, until })` - Chronological list
- `getCommit(owner, repo, sha)` - Full commit with diff
- `getFileContent(owner, repo, path, ref)` - File at specific commit

**Authentication**: Personal access token (stored in env var or manual input)

## Data Models

### State File (`state.json`)
```json
{
  "repoUrl": "https://github.com/user/repo",
  "currentCommit": 47,
  "totalCommits": 523,
  "processedFiles": 234,
  "lastMetaAnalysis": 45,
  "status": "paused|running|stopped",
  "costEstimate": 2.34
}
```

### Agent Output (Code Analysis)
```json
{
  "concepts": ["Authentication", "Session Management"],
  "codeElements": [
    {
      "name": "AuthService",
      "type": "class",
      "purpose": "Handles user authentication flow"
    }
  ],
  "relationships": ["uses SessionManager", "called by UserController"]
}
```

### Wiki Metadata (`_metadata.json`)
```json
{
  "pages": {
    "Authentication": {
      "path": "concepts/authentication.md",
      "incomingLinks": 12,
      "lastUpdated": "2025-11-22T10:30:00Z"
    }
  },
  "requestQueue": [
    {
      "topic": "caching strategy",
      "priority": "high",
      "requestedAt": "2025-11-22T10:30:00Z"
    }
  ]
}
```

## User Workflows

### Initial Setup
1. Clone repository
2. `npm install`
3. Create `.env` file with API keys (or leave blank for manual input)
4. `npm start`
5. Open http://localhost:3000

### Manual Stepping (Phase 1)
1. Enter repository URL in dashboard
2. Click "Load Repository"
3. System fetches commit history
4. Click "Step" to process one commit
5. Review agent output in log panel
6. View generated wiki pages in sidebar
7. Edit pages directly if needed (via file system or UI button)
8. Repeat steps 4-7 to tune prompts and verify quality

### Batch Processing (Phase 2)
1. After manual validation, click "Process Next 10"
2. System automatically processes 10 commits
3. Pause at any time
4. Review generated documentation
5. Continue or adjust prompts

### MCP Server Integration (Phase 3)
1. Start MCP server: `npm run mcp-server`
2. Configure Claude Code to connect
3. Claude Code queries: "How do I run tests?"
4. MCP server returns relevant wiki page
5. Claude Code uses context for task

## Agent Prompt Templates

### Code Analysis Agent
```
You are analyzing a code change to generate documentation.

Changed file: {{filePath}}
Commit message: {{commitMessage}}
Diff:
{{diff}}

Existing related documentation:
{{relatedPages}}

Task: Identify new concepts, classes, functions, and patterns.
Return JSON only:
{
  "concepts": ["array of concepts"],
  "codeElements": [{"name": "...", "type": "class|function|module", "purpose": "..."}],
  "relationships": ["array of relationships to other concepts"]
}

Be concise. Only document significant additions. DO NOT output anything other than valid JSON.
```

### Documentation Writer Agent
```
You are writing documentation for a codebase wiki.

Concept/Component: {{conceptName}}
Code Analysis:
{{codeAnalysis}}

Existing documentation (if any):
{{existingContent}}

Task: Write clear, concise documentation in markdown format.
Include:
- Purpose and overview (2-3 sentences)
- Key functionality
- Relationships to other components
- Usage examples if relevant

Keep it under 500 words unless complexity requires more.
Write in present tense. Be specific and accurate.
```

### Meta-Analysis Agent
```
You have processed 5 commits. Review the documentation progress.

New concepts identified: {{concepts}}
Pages created/updated: {{pageList}}

Tasks:
1. Identify overarching themes or architecture patterns
2. Suggest new high-level documentation pages needed
3. Flag any inconsistencies or gaps
4. Recommend page reorganization if needed

Return JSON:
{
  "themes": ["array of identified patterns"],
  "newPagesNeeded": [{"title": "...", "reason": "..."}],
  "gaps": ["array of missing documentation"],
  "reorganization": [{"from": "...", "to": "...", "reason": "..."}]
}

DO NOT output anything other than valid JSON.
```

## Error Handling

**Claude API Errors**:
- Rate limit: Wait 60s, retry, log warning
- Invalid response: Log error, skip file, continue
- Token limit exceeded: Truncate diff, retry once
- API key invalid: Pause processing, prompt user via UI

**GitHub API Errors**:
- Rate limit: Pause processing, show ETA in UI
- Invalid repo URL: Validate upfront, show error
- Network error: Retry 3x with exponential backoff

**File System Errors**:
- Write failure: Log error, attempt backup location
- Disk space: Check before processing, alert user

## Cost Control

**Budget Limits**:
- Default: $10/day
- Configurable via UI and `.env`
- Track running total in state file
- Estimate cost before processing (commits × avg cost)
- Pause when approaching limit

**Token Optimization**:
- Truncate large diffs (>2000 lines) to relevant sections
- Cache common wiki pages in memory
- Limit related pages to 3 maximum
- Use smaller prompts for simple files (utils, configs)

## Quality Validation

**Agent Output Checks**:
- Validate JSON structure before processing
- Verify markdown is well-formed
- Check for hallucinated file paths/concepts
- Log warnings for suspicious content

**Human Review Points**:
- After first 5 commits (manual stepping)
- Every 20 commits in batch mode
- When meta-analysis suggests major changes
- When cost exceeds threshold

## Development Phases

### Phase 1: Manual Stepping (MVP)
**Timeline**: Weekend 1  
**Features**:
- Load repository via Octokit
- Process one commit at a time
- View agent output in real-time
- Edit wiki pages via file system
- Basic dashboard with step button

**Goal**: Validate that agents produce useful documentation

### Phase 2: Supervised Automation
**Timeline**: Weekend 2  
**Features**:
- Batch processing (N commits)
- Pause/resume
- Cost tracking
- Better error handling
- Meta-analysis integration

**Goal**: Speed up processing while maintaining quality

### Phase 3: MCP Server
**Timeline**: Weekend 3  
**Features**:
- Simple MCP server implementation
- Query wiki via Claude Code
- Request queue for missing docs
- Basic metrics dashboard

**Goal**: Prove value for AI-assisted development

## Self-Referential Development

**Critical Feature**: This system's own wiki will be used during development.

**Process**:
1. Initialize empty wiki in `./docs/wiki`
2. As you build features, run processor on the codebase itself
3. Use generated wiki to understand your own architecture
4. If wiki is confusing, prompts need improvement
5. Edit prompts, reprocess, verify improvement

**Benefits**:
- Immediate feedback on documentation quality
- Dogfooding ensures usefulness
- AI-augmented test-driven development
- Developer sees exactly what Claude Code will see

**Example**: When implementing the Dashboard component, query the wiki: "How is the Processor initialized?" If the answer is unclear, the documentation needs work.

## API Key Management

**Anthropic API Key**:
- Option 1: Set `ANTHROPIC_API_KEY` environment variable
- Option 2: Enter via UI at startup (stored in session, not persisted)
- Manual fallback: For testing, use UI buttons to trigger actions without key

**GitHub Token**:
- Option 1: Set `GITHUB_TOKEN` environment variable  
- Option 2: Enter via UI (public repos work without token but hit rate limits)
- Manual fallback: UI provides option to input commit data manually

**Manual Fallback Flow**:
When API key is missing:
1. System detects missing key
2. UI shows "Manual Mode" option
3. User can paste commit data directly
4. Or user can review/edit agent output before it's processed
5. Or developer (human) can act as "agent" and write docs directly

## File Structure

```
codewiki-generator/
├── server.js              # Express app entry point
├── lib/
│   ├── github.js          # Octokit wrapper
│   ├── claude.js          # Anthropic SDK wrapper
│   ├── processor.js       # Main processing loop
│   ├── agents.js          # Agent prompt templates & calling
│   ├── wiki-manager.js    # Read/write wiki files
│   └── websocket.js       # Real-time updates
├── views/
│   ├── dashboard.ejs      # Main UI
│   ├── wiki-page.ejs      # Page viewer
│   └── partials/
│       ├── sidebar.ejs
│       └── log.ejs
├── public/
│   ├── style.css
│   └── app.js             # Client-side JavaScript
├── wiki/                  # Generated documentation
│   ├── concepts/
│   ├── components/
│   ├── guides/
│   └── _metadata.json
├── state.json             # Processing state
├── .env.example           # Template for API keys
├── package.json
└── README.md
```

## Implementation Notes

**Start Simple**:
- Phase 1 can be built in ~200 lines of code
- Don't optimize prematurely
- Get one commit processing end-to-end first
- Add features incrementally

**Key Dependencies**:
```json
{
  "dependencies": {
    "express": "^5.1.0",
    "ejs": "^3.1.10",
    "@anthropic-ai/sdk": "^0.70.0",
    "octokit": "^5.0.5",
    "ws": "^8.18.0",
    "dotenv": "^16.4.5"
  }
}
```

**Environment Variables** (`.env`):
```
ANTHROPIC_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here  # Optional for public repos
PORT=3000
WIKI_PATH=./wiki
MAX_DAILY_COST=10
```

**Testing Strategy**:
- Use small test repo (20-50 commits)
- Process first 5 commits manually
- Verify wiki is useful
- Tune prompts
- Scale to full repo

## Success Metrics

**Technical**:
- Processing speed: 2-3 commits/minute
- Cost efficiency: <$0.05 per commit
- Wiki coverage: 80% of significant code documented
- Link density: 5+ incoming links for core concepts

**Qualitative**:
- Can answer "How do I...?" questions from wiki alone
- New developer can onboard using wiki
- Wiki accurately reflects current code state
- Developer uses wiki while coding (via MCP)

## Future Enhancements (Post-v1)

- Diagram generation (Mermaid)
- Code search integration
- Multi-repo support
- Team collaboration (comments, reviews)
- Custom agent creation
- Deployment automation
- Analytics dashboard

---

**Version**: 1.0  
**Last Updated**: November 22, 2025  
**Status**: Ready for Implementation
