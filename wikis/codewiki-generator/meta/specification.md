---
title: Specification
category: meta
sourceFile: Specification.md
created: 2025-11-24
updated: 2025-11-25
related: [meta/overview.md, components/code-analysis-agent.md, components/documentation-writer-agent.md]
---

# CodeWiki Generator - Technical Specification

## [Overview](../meta/overview.md)

CodeWiki Generator is an autonomous system that generates and maintains comprehensive wiki documentation by progressively analyzing git history. It creates a living knowledge base that evolves with the code, solving the problem of stale documentation and difficult codebase onboarding.

**Primary Users**: Solo developers and small teams who want automated, high-quality documentation without manual maintenance overhead.

## Problem & Solution

### The Problem
- Understanding large codebases is difficult
- Documentation becomes stale and diverges from reality
- Mental models misalign with actual code
- Onboarding new developers is painful and time-consuming

### The Solution
An autonomous system that walks through git commits chronologically, analyzes code changes using Claude AI, and builds/updates wiki documentation incrementally. A dashboard provides real-time visibility and manual control.

## Success Criteria

- Process a 100-commit repository in under 30 minutes
- Generate 15-20 interconnected wiki pages
- Documentation is immediately useful for understanding the codebase
- Cost under $5 per 100 commits (Claude API)
- Integrate with MCP server to provide context to Claude Code

## What's Explicitly NOT v1 (Non-Goals)

- Real-time/always-on processing
- Multi-repository support
- Team collaboration features
- Custom agent creation UI
- Diagram generation
- Full-text code search
- Authentication/permissions
- Deployment to production servers

## Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js LTS | 24.x |
| Web Framework | Express | 5.1.0 |
| Templating | EJS | 3.1.10 |
| GitHub Integration | Octokit | 5.0.5 |
| AI Processing | Anthropic SDK | 0.70.0 |
| Wiki Storage | Local markdown files | Git-friendly |

## Architecture [Overview](../meta/overview.md)

```
Repository → Git History Walker → AI Agents → Wiki (Markdown)
                    ↓                               ↓
              Dashboard UI ← WebSocket Updates ← Progress
```

The system processes commits chronologically, analyzes changes using specialized Claude agents, and incrementally builds wiki documentation. Real-time updates flow to the dashboard for human oversight.

See also: [[Architecture]]

## Core Components

### 1. Dashboard (Express + EJS)

Human-in-the-loop control interface providing real-time visibility and manual control.

**Key Routes**:
- `GET /` - Main dashboard with control panel
- `GET /wiki/:page` - View individual wiki page
- `POST /process/start` - Begin processing
- `POST /process/pause` - Pause processing
- `POST /process/step` - Process single commit
- `GET /api/status` - Current state (JSON)
- WebSocket `/ws` - Real-time progress updates

**Views**:
- Dashboard control panel + processing log
- Wiki page renderer with markdown viewer
- Sidebar for wiki navigation

### 2. Processor

Main processing loop orchestrating the analysis workflow.

**Processing Flow**:

1. Fetch commit data via GitHub API (Octokit)
2. Identify changed files
3. For each significant file:
   - Retrieve relevant wiki context (≤3 pages)
   - Call [Code Analysis Agent](../components/code-analysis-agent.md)
   - Update wiki pages via [Documentation Writer Agent](../components/documentation-writer-agent.md)
4. Broadcast progress via WebSocket
5. Every 5 commits: Trigger meta-analysis
6. Save state for resumability

**Key Functions**:
- `processRepository(repoUrl, startCommit)` - Main entry point
- `processCommit(commit)` - Handle single commit analysis
- `runMetaAnalysis()` - Identify themes and gaps
- `saveState()` / `loadState()` - Persistence

### 3. AI Agents

Specialized Claude API calls for different documentation tasks.

#### [Code Analysis Agent](../components/code-analysis-agent.md)
- **Input**: File diff, commit message, related wiki pages
- **Output**: JSON with concepts, code elements, relationships
- **Model**: claude-sonnet-4-20250514
- **Max tokens**: 2000

Identifies new concepts, classes, functions, and patterns from code changes.

#### Documentation Writer Agent
- **Input**: Code analysis output, existing page content
- **Output**: Markdown documentation
- **Model**: claude-sonnet-4-20250514
- **Max tokens**: 3000

Transforms analysis into clear, concise documentation with examples and relationships.

#### Meta-Analysis Agent
- **Trigger**: Every 5 commits
- **Input**: Summary of concepts from last 5 commits, page titles
- **Output**: JSON with themes, reorganization suggestions, gaps
- **Model**: claude-sonnet-4-20250514
- **Max tokens**: 2000

Identifies overarching patterns, recommends new pages, and flags documentation gaps.

### 4. Wiki Manager

Manages markdown files with frontmatter metadata.

**Structure**:
```
wiki/
├── concepts/       # High-level abstractions
├── components/     # Classes, modules, services
├── guides/        # How-to documentation
├── index.md       # Entry point
└── _metadata.json # Page relationships and stats
```

**Page Format**:
Each page includes YAML frontmatter with metadata followed by markdown content.

**Key Operations**:
- `getPage(title)` - Read markdown + parse frontmatter
- `updatePage(title, content, metadata)` - Write with history
- `getRelatedPages(filePath)` - Find relevant context (≤3 pages)
- `searchPages(keywords)` - Simple keyword search
- `getAllPages()` - List for sidebar navigation

See also: [[Wiki Markdown Management System]], [[Frontmatter Parsing Pattern]]

### 5. GitHub Integration

Accesses repository data chronologically.

**Key Operations**:
- `getCommits(owner, repo, { since, until })` - Chronological list
- `getCommit(owner, repo, sha)` - Full commit with diff
- `getFileContent(owner, repo, path, ref)` - File at specific commit

**Authentication**:
- Personal access token (environment variable or manual input)
- Public repos work without token but hit rate limits

See also: [[GitHub API Client with Resilient Retry Logic]], [[Repository URL Parsing and Normalization]]

## Data Models

### State File (`state.json`)

Persists processing progress and cost tracking.

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

### Agent Output (Code Analysis Example)

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

Tracks page relationships and documentation requests.

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

See also: [[Persistent State Management with Validation]], [[Structured Git Metadata Extraction]]

## User Workflows

### Phase 1: Manual Stepping (MVP)

Validate agent output quality with human oversight.

1. Enter repository URL in dashboard
2. Click "Load Repository" - system fetches commit history
3. Click "Step" to process one commit
4. Review agent output in log panel
5. View generated wiki pages in sidebar
6. Edit pages directly if needed (via file system or UI)
7. Repeat to tune prompts and verify quality

**Goal**: Validate that agents produce useful documentation

### Phase 2: Supervised Automation

Speed up processing while maintaining quality controls.

1. After manual validation, click "Process Next 10"
2. System automatically processes 10 commits
3. Pause at any time to review
4. Continue or adjust prompts
5. Monitor cost tracking

**Goal**: Accelerate processing with human checkpoints

### Phase 3: MCP Server Integration

Provide context to Claude Code during development.

1. Start MCP server: `npm run mcp-server`
2. Configure Claude Code to connect
3. Claude Code queries: "How do I run tests?"
4. MCP server returns relevant wiki page
5. Claude Code uses context for task

**Goal**: Prove value for AI-assisted development

## Cost Control & Budget Management

### Budget Limits

- Default: $10/day
- Configurable via UI and `.env`
- Track running total in state file
- Estimate cost before processing (commits × avg cost)
- Pause when approaching limit

### Token Optimization

- Truncate large diffs (>2000 lines) to relevant sections
- Cache common wiki pages in memory
- Limit related pages to 3 maximum
- Use smaller prompts for simple files (utils, configs)

### Cost Performance

- Target: <$0.05 per commit
- Target: <$5 per 100-commit repository
- Processing speed: 2-3 commits/minute

## Error Handling Strategy

### Claude API Errors
- **Rate limit**: Wait 60s, retry, log warning
- **Invalid response**: Log error, skip file, continue
- **Token limit exceeded**: Truncate diff, retry once
- **API key invalid**: Pause processing, prompt via UI

### GitHub API Errors
- **Rate limit**: Pause processing, show ETA in UI
- **Invalid repo URL**: Validate upfront, show error
- **Network error**: Retry 3x with exponential backoff

### File System Errors
- **Write failure**: Log error, attempt backup location
- **Disk space**: Check before processing, alert user

See also: [[Graceful Error Handling for File Operations]], [[Safe File Operation Pattern]]

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

This self-referential approach is a key validation mechanism—if the system can't document itself clearly, it won't effectively document other codebases.

## API Key Management

### Anthropic API Key
- **Option 1**: Set `ANTHROPIC_API_KEY` environment variable
- **Option 2**: Enter via UI at startup (stored in session, not persisted)
- **Manual fallback**: UI buttons trigger actions without key for testing

### GitHub Token
- **Option 1**: Set `GITHUB_TOKEN` environment variable
- **Option 2**: Enter via UI (public repos work without token)
- **Manual fallback**: UI provides option to input commit data manually

### Manual Fallback Flow
When API key is missing:
1. System detects missing key
2. UI shows "Manual Mode" option
3. User can paste commit data directly
4. Or review/edit agent output before processing
5. Or developer acts as "agent" and writes docs directly

See also: [[Environment Based Configuration with Test Mode Separation]]

## Quality Validation

### Agent Output Checks
- Validate JSON structure before processing
- Verify markdown is well-formed
- Check for hallucinated file paths/concepts
- Log warnings for suspicious content

### Human Review Points
- After first 5 commits (manual stepping)
- Every 20 commits in batch mode
- When meta-analysis suggests major changes
- When cost exceeds threshold

## Implementation Strategy

### Start Simple
- Phase 1 can be built in ~200 lines of code
- Don't optimize prematurely
- Get one commit processing end-to-end first
- Add features incrementally

### Key Dependencies
```
express ^5.1.0
ejs ^3.1.10
@anthropic-ai/sdk ^0.70.0
octokit ^5.0.5
ws ^8.18.0
dotenv ^16.4.5
```

### Environment Variables (`.env`)
```
ANTHROPIC_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here
PORT=3000
WIKI_PATH=./wiki
MAX_DAILY_COST=10
```

### Testing Strategy
- Use small test repo (20-50 commits)
- Process first 5 commits manually
- Verify wiki is useful
- Tune prompts
- Scale to full repo

See also: [[Testing Approach]], [[Test Infrastructure Configuration]]

## Success Metrics

### Technical Metrics
- **Processing speed**: 2-3 commits/minute
- **Cost efficiency**: <$0.05 per commit
- **Wiki coverage**: 80% of significant code documented
- **Link density**: 5+ incoming links for core concepts

### Qualitative Metrics
- Can answer "How do I...?" questions from wiki alone
- New developer can onboard using wiki
- Wiki accurately reflects current code state
- Developer uses wiki while coding (via MCP)

## File Structure

```
codewiki-generator/
├── server.js
├── lib/
│   ├── github.js
│   ├── claude.js
│   ├── processor.js
│   ├── agents.js
│   ├── wiki-manager.js
│   └── websocket.js
├── views/
│   ├── dashboard.ejs
│   ├── wiki-page.ejs
│   └── partials/
├── public/
│   ├── style.css
│   └── app.js
├── wiki/
├── state.json
├── .env.example
├── package.json
└── README.md
```

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
**Status**: Ready for Implementation  
**Last Updated**: November 22, 2025