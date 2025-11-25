---
title: Specification
category: meta
sourceFile: Specification.md
created: 2025-11-24
updated: 2025-11-25
related: [meta/overview.md, components/code-analysis-agent.md, components/documentation-writer-agent.md]
---

# Technical Specification

## Overview

CodeWiki Generator is an autonomous system that generates and maintains comprehensive wiki documentation by progressively analyzing git history. It creates a living knowledge base that evolves with the code, solving the critical problem of stale documentation and difficult codebase onboarding.

**Primary Users**: Solo developers and small teams who want automated, high-quality documentation without manual maintenance overhead.

## Problem & Solution

### The Problem
Understanding large codebases is difficult. Documentation becomes stale, mental models diverge from reality, and onboarding is painful. Team members spend significant time context-switching and re-learning architectural decisions.

### The Solution
Process git history chronologically through AI agents that analyze code changes and automatically generate interconnected documentation. The system builds a living knowledge base that stays synchronized with the codebase through continuous, incremental processing.

## Success Criteria

- Process a 100-commit repository in under 30 minutes
- Generate 15-20 interconnected wiki pages from analysis
- Documentation is immediately useful for understanding the codebase
- Cost under $5 per 100 commits (Claude API)
- Integration with MCP server to provide context to Claude Code

## Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js LTS | 24.x |
| Web Framework | Express | 5.1.0 |
| Templating | EJS | 3.1.10 |
| GitHub Integration | Octokit | 5.0.5 |
| AI Processing | Anthropic SDK | 0.70.0 |
| Wiki Storage | Local Markdown | Git-friendly |

## Architecture Overview

The system follows a sequential pipeline:

```
Repository → Git History Walker → AI Agents → Wiki (Markdown)
                    ↓                               ↓
              Dashboard UI ← WebSocket Updates ← Progress
```

The processor walks through git commits chronologically, analyzes code changes using Claude AI agents, and builds/updates wiki documentation incrementally. A dashboard provides real-time visibility and manual control.

## Core Components

### 1. Dashboard (Express + EJS)

**Purpose**: Human-in-the-loop control interface for monitoring and managing documentation generation.

**Key Routes**:
- `GET /` - Main control panel
- `GET /wiki/:page` - View individual wiki page
- `POST /process/start` - Begin processing
- `POST /process/pause` - Pause current processing
- `POST /process/step` - Process single commit
- `GET /api/status` - Current state (JSON)
- WebSocket `/ws` - Real-time progress updates

**Views**: Dashboard control panel with processing log, wiki page renderer, and navigation sidebar.

### 2. Processor

**Purpose**: Main orchestration loop that coordinates git analysis, AI processing, and wiki updates.

**Processing Flow**:
1. Fetch commit data from GitHub via Octokit
2. Identify changed files
3. For each significant file:
   - Retrieve relevant wiki context (≤3 pages)
   - Call appropriate AI agent
   - Update or create wiki pages
4. Broadcast progress via WebSocket
5. Every 5 commits: trigger meta-analysis
6. Save processing state for resumability

**Key Functions**: `processRepository()`, `processCommit()`, `runMetaAnalysis()`, `saveState()`, `loadState()`

### 3. AI Agents

Three specialized Claude API agents handle different documentation tasks:

**Code Analysis Agent**
- Analyzes file diffs and commit messages
- Extracts concepts, code elements, and relationships
- Output: JSON with structured code intelligence
- Model: claude-sonnet-4-20250514
- Max tokens: 2000

**Documentation Writer Agent**
- Converts code analysis into readable markdown
- Integrates existing documentation
- Includes examples and relationships
- Model: claude-sonnet-4-20250514
- Max tokens: 3000

**Meta-Analysis Agent** (triggered every 5 commits)
- Identifies overarching themes and patterns
- Suggests new documentation pages
- Detects gaps and reorganization opportunities
- Model: claude-sonnet-4-20250514
- Max tokens: 2000

### 4. Wiki Manager

**Purpose**: Read/write markdown files with frontmatter metadata and relationship tracking.

**Directory Structure**:
```
wiki/
├── concepts/         # High-level abstractions
├── components/       # Classes, modules, services
├── guides/          # How-to documentation
├── index.md         # Entry point
└── _metadata.json   # Page relationships and stats
```

**Page Format**: Each page includes YAML frontmatter (title, created date, updated date, related pages) followed by markdown content.

**Key Operations**: `getPage()`, `updatePage()`, `getRelatedPages()`, `searchPages()`, `getAllPages()`

### 5. GitHub Integration

**Purpose**: Secure access to repository data via authenticated API calls.

**Key Operations**:
- `getCommits()` - Retrieve chronological commit list
- `getCommit()` - Full commit details with diff
- `getFileContent()` - File content at specific revision

**Authentication**: Personal access token stored in environment variable or provided via UI. Public repos work without token but with rate limit restrictions.

## Data Models

### Processing State (`state.json`)

Tracks progress for resumable processing:
- Current commit index and total commits
- Files processed count
- Last meta-analysis trigger point
- Processing status (running/paused/stopped)
- Running cost estimate

### Agent Outputs

**Code Analysis**: JSON structure with concepts array, code elements with metadata, and relationship descriptions.

**Wiki Metadata** (`_metadata.json`): Global page registry with incoming link counts, last update timestamps, and documentation request queue.

## Development Phases

### Phase 1: Manual Stepping (MVP)
**Goal**: Validate agent-generated documentation quality

Features:
- Load repository and fetch commits
- Process one commit at a time
- View agent output in real-time
- Edit wiki pages via file system
- Basic dashboard controls

### Phase 2: Supervised Automation
**Goal**: Speed up processing while maintaining quality

Features:
- Batch processing (configurable N commits)
- Pause/resume capability
- Cost tracking and budget enforcement
- Improved error handling
- Meta-analysis integration

### Phase 3: MCP Server
**Goal**: Integrate with Claude Code for context-aware development

Features:
- MCP server implementation
- Query wiki for context during coding
- Documentation request queue
- Basic metrics dashboard

## Processing Strategy

### File Significance Filtering

Not every file change generates documentation. The system intelligently filters:
- Exclude test files, configuration files, and utilities
- Focus on core business logic changes
- Skip minor formatting or comment-only changes

### Cost Control & Optimization

**Budget Limits**:
- Default: $10/day (configurable)
- Track running total in state
- Estimate cost before starting
- Pause when approaching limit

**Token Optimization**:
- Truncate large diffs (>2000 lines) to relevant sections
- Cache common wiki pages in memory
- Limit related pages to 3 maximum
- Use smaller prompts for simple files

### Quality Validation

**Agent Output Checks**:
- Validate JSON structure before processing
- Verify markdown formatting
- Check for hallucinated file paths
- Log warnings for suspicious content

**Human Review Points**:
- After first 5 commits (manual stepping phase)
- Every 20 commits in batch mode
- When meta-analysis suggests major changes
- When cost exceeds configured threshold

## User Workflows

### Initial Setup
1. Clone repository: `git clone <repo>`
2. Install dependencies: `npm install`
3. Create `.env` file with API keys or leave blank
4. Start server: `npm start`
5. Open http://localhost:3000

### Manual Stepping (Phase 1)
1. Enter repository URL in dashboard
2. System loads commit history
3. Click "Step" to process one commit
4. Review agent output in log panel
5. View generated wiki pages in sidebar
6. Optionally edit pages or tune prompts
7. Repeat to validate quality before batch processing

### Batch Processing (Phase 2)
1. After manual validation, click "Process Next 10"
2. System automatically processes multiple commits
3. Pause at any time to review
4. Continue or adjust prompts as needed

### MCP Server Integration (Phase 3)
1. Start MCP server: `npm run mcp-server`
2. Configure Claude Code to connect
3. Claude Code queries: "How do I run tests?"
4. MCP server returns relevant wiki pages
5. Claude Code uses context for development task

## Self-Referential Development

**Critical Feature**: This system's own wiki is generated using the CodeWiki system itself.

This creates a powerful feedback loop:
- Build features → Run processor on codebase → Review generated wiki
- If wiki is confusing → Improve prompts → Reprocess → Verify
- Developer sees exactly what end-users will see
- AI-augmented test-driven development approach

**Benefits**:
- Immediate feedback on documentation quality
- Ensures practical usefulness
- Prompts are validated by real-world usage
- Architecture becomes self-documenting

## Non-Goals (v1)

- Real-time or always-on processing
- Multi-repository support
- Team collaboration features
- Custom agent creation UI
- Diagram generation (Mermaid)
- Full-text code search
- Authentication/permissions
- Production deployment automation

These features are planned for future versions as the MVP proves value.

## Error Handling Strategy

### Claude API Errors

- **Rate Limit**: Wait 60 seconds, retry, log warning
- **Invalid Response**: Log error, skip file, continue processing
- **Token Limit**: Truncate diff, retry once
- **Invalid Key**: Pause processing, prompt user via UI

### GitHub API Errors

- **Rate Limit**: Pause processing, show ETA to user
- **Invalid URL**: Validate upfront, show error immediately
- **Network Error**: Retry 3 times with exponential backoff

### File System Errors

- **Write Failure**: Log error, attempt backup location
- **Disk Space**: Check before processing, alert user

## Success Metrics

### Technical Metrics
- Processing speed: 2-3 commits per minute
- Cost efficiency: <$0.05 per commit
- Wiki coverage: 80% of significant code documented
- Link density: 5+ incoming links for core concepts

### Qualitative Metrics
- Can answer "How do I...?" questions using wiki alone
- New developers can onboard using generated documentation
- Wiki accurately reflects current code state
- Developer uses wiki during development (via MCP)

## API Key Management

### Anthropic API Key
- **Option 1**: Set `ANTHROPIC_API_KEY` environment variable
- **Option 2**: Enter via UI at startup (session-only, not persisted)
- **Fallback**: Manual review/approval of agent output before processing

### GitHub Token
- **Option 1**: Set `GITHUB_TOKEN` environment variable
- **Option 2**: Enter via UI (optional for public repos)
- **Fallback**: Manual paste of commit data for testing

## Key Dependencies

```
express ^5.1.0
ejs ^3.1.10
@anthropic-ai/sdk ^0.70.0
octokit ^5.0.5
ws ^8.18.0
dotenv ^16.4.5
```

## Environment Variables

```
ANTHROPIC_API_KEY=your_key_here
GITHUB_TOKEN=your_token_here          # Optional
PORT=3000
WIKI_PATH=./wiki
MAX_DAILY_COST=10
```

## Implementation Philosophy

**Start Simple**: Phase 1 can be built in ~200 lines of code. Process one commit end-to-end first, then add features incrementally. Don't optimize prematurely.

**Use Small Test Repos**: Validate with 20-50 commits before scaling to larger repositories. Process first 5 commits manually to tune prompts.

**Dogfood the System**: Apply CodeWiki to itself. Use the generated wiki to understand the architecture as it's being built.

---

**Version**: 1.0  
**Last Updated**: November 22, 2025  
**Status**: Ready for Implementation