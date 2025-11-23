---
title: Technical Specification
category: meta
layer: meta
tags: [philosophy, vision]
related: [components/dashboard-control-interface.md, concepts/architecture.md, guides/getting-started.md, guides/development-workflow.md, concepts/step-wise-processing-control.md]
updated: 2025-11-23
created: 2025-11-23
sourceFile: Specification.md
sourceType: imported
themes: [autonomous documentation, git history analysis, AI-powered documentation, progressive processing, human-in-the-loop control]
mentions: [Dashboard, Processor, WikiManager, AI Agents, GitHub Integration]
---
[Home](../index.md) > [Meta](../meta) > Specification

## Table of Contents

- [Context & Goals](#context-goals)
- [Technical Stack](#technical-stack)
- [Architecture Overview](#architecture-overview)
- [Core Components](#core-components)
  - [1. Dashboard (Express + EJS)](#1-dashboard-express-ejs)
  - [2. Processor](#2-processor)
  - [3. AI Agents](#3-ai-agents)
  - [4. Wiki Manager](#4-wiki-manager)
  - [5. GitHub Integration](#5-github-integration)
- [Data Models](#data-models)
  - [State File (`state.json`)](#state-file-statejson)
  - [Agent Output (Code Analysis)](#agent-output-code-analysis)
- [User Workflows](#user-workflows)
  - [Initial Setup](#initial-setup)
  - [Manual Stepping (Phase 1)](#manual-stepping-phase-1)
  - [Batch Processing (Phase 2)](#batch-processing-phase-2)
  - [MCP Server Integration (Phase 3)](#mcp-server-integration-phase-3)
- [Error Handling](#error-handling)
- [Cost Control](#cost-control)
- [Development Phases](#development-phases)
  - [Phase 1: Manual Stepping (MVP)](#phase-1-manual-stepping-mvp)
  - [Phase 2: Supervised Automation](#phase-2-supervised-automation)
  - [Phase 3: MCP Server](#phase-3-mcp-server)
- [Self-Referential Development](#self-referential-development)
- [API Key Management](#api-key-management)
- [File Structure](#file-structure)
- [Success Metrics](#success-metrics)
- [Implementation Notes](#implementation-notes)
- [See Also](#see-also)

# Technical Specification

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

## Technical Stack

- **Runtime**: Node.js 24.x LTS
- **Web Framework**: Express 5.1.0
- **Templating**: EJS 3.1.10
- **GitHub Integration**: Octokit 5.0.5
- **AI Processing**: Anthropic SDK 0.70.0
- **Wiki Storage**: Local markdown files (git-friendly)

## [Architecture](../concepts/architecture.md) Overview

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

### 2. Processor
**Purpose**: Main processing loop

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
├── [index](../index.md).md         # Entry point
└── _metadata.json   # Page relationships, stats
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
7. Edit pages directly if needed
8. Repeat to tune prompts and verify quality

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
3. Use generated wiki to understand your own [architecture](../concepts/architecture.md)
4. If wiki is confusing, prompts need improvement
5. Edit prompts, reprocess, verify improvement

**Benefits**:
- Immediate feedback on documentation quality
- Dogfooding ensures usefulness
- AI-augmented test-driven development
- Developer sees exactly what Claude Code will see

## API Key Management

**Anthropic API Key**:
- Option 1: Set `ANTHROPIC_API_KEY` environment variable
- Option 2: Enter via UI at startup (stored in session, not persisted)
- Manual fallback: For testing, use UI buttons to trigger actions without key

**GitHub Token**:
- Option 1: Set `GITHUB_TOKEN` environment variable
- Option 2: Enter via UI (public repos work without token but hit rate limits)
- Manual fallback: UI provides option to input commit data manually

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

## See Also

**Related Topics:**
- [Dashboard Control Interface](../components/dashboard-control-interface.md)
- [architecture](../concepts/architecture.md)
- [getting-started](../guides/getting-started.md)
- [development-workflow](../guides/development-workflow.md)
- [Step-wise processing control](../concepts/step-wise-processing-control.md)
