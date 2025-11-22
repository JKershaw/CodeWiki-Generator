---
title: CodeWiki Generator Architecture
created: 2025-11-22
updated: 2025-11-22
related: [Getting Started]
---

# Architecture Overview

CodeWiki Generator is designed as a pipeline that transforms git history into structured wiki documentation using AI agents.

## High-Level Flow

```
Git Repository → GitHub Integration → Processor → AI Agents → Wiki Manager → Markdown Files
                                          ↓
                                    Dashboard UI
                                          ↓
                                    WebSocket Updates
```

## Core Components

### 1. GitHub Integration (`lib/github.js`)
Wraps the Octokit library to access repository data:
- Fetches commit history chronologically
- Retrieves file diffs
- Gets file content at specific commits
- Handles authentication and rate limiting

### 2. Processor (`lib/processor.js`)
The main orchestration engine that coordinates all components:

**processRepository(repoUrl, options)**:
- Parses GitHub repository URL
- Fetches all commits chronologically
- Loads saved state or initializes fresh
- Implements pause/resume from any commit
- Enforces cost limits before each commit
- Triggers meta-analysis every N commits (default: 5)
- Saves state after each commit for crash recovery
- Returns comprehensive processing statistics

**processCommit(commit, state)**:
- Filters files (skips deletions, binary files, insignificant files)
- Retrieves relevant wiki context (up to 3 related pages)
- Analyzes each significant file via CodeAnalysisAgent
- Generates/updates documentation via DocumentationWriterAgent
- Creates or updates wiki pages via WikiManager
- Tracks per-commit statistics

**File Filtering**:
- Processes: source code (.js, .ts, .py, .java, .go, etc.)
- Skips: config files, lock files, tests, docs, build artifacts

### 3. AI Agents (`lib/agents/`)
Specialized Claude API calls for different tasks:

**Code Analysis Agent**: Analyzes file diffs and extracts:
- Concepts (high-level ideas)
- Code elements (classes, functions, modules)
- Relationships between components

**Documentation Writer Agent**: Generates markdown documentation:
- Creates new wiki pages
- Updates existing pages
- Maintains consistent style
- Links related concepts

**Meta-Analysis Agent**: Identifies patterns across commits:
- Discovers themes
- Suggests new documentation pages
- Identifies gaps
- Recommends reorganization

### 4. Wiki Manager (`lib/wiki-manager.js`)
Handles all wiki file operations:
- Reads markdown files with frontmatter
- Writes new pages
- Updates existing pages
- Searches for relevant context
- Manages page metadata
- Maintains page relationships

### 5. State Manager (`lib/state-manager.js`)
Persists processing state:
- Current commit position
- Processing statistics
- Cost tracking
- Pause/resume capability
- Error recovery data

### 6. Dashboard (`server.js`, `views/`)
Web interface for human oversight:
- Express.js server with EJS templates
- Real-time progress via WebSocket
- Manual stepping controls
- Wiki page viewer
- Configuration interface
- Cost monitoring

## Data Flow

### Complete System Flow

```
User Request → processRepository(repoUrl)
    ↓
[1] Parse Repository URL (GitHub Client)
    ↓
[2] Fetch All Commits (GitHub API)
    ↓
[3] Load or Initialize State (State Manager)
    ↓
[4] FOR EACH Commit:
    ├─ Check Cost Limit → PAUSE if exceeded
    ├─ Process Commit (see below)
    ├─ Aggregate Statistics
    ├─ Save State (State Manager)
    └─ Meta-Analysis Check
        └─ IF at frequency interval:
            ├─ Run MetaAnalysisAgent
            ├─ Store recommendations
            └─ Save State
    ↓
[5] Mark Complete & Return Statistics
```

### Processing a Single Commit (Step 4 Detail)

```
Commit Object (sha, message, files[])
    ↓
[A] FOR EACH File:
    ├─ Has patch? → SKIP if no
    ├─ Is significant? → SKIP if no
    ├─ Get Context (WikiManager.getRelatedPages)
    │   └─ Return ≤3 related pages
    ├─ Analyze Code (CodeAnalysisAgent)
    │   ├─ Input: filePath, diff, message, relatedPages
    │   └─ Output: { concepts[], codeElements[], relationships[] }
    └─ FOR EACH Concept:
        ├─ Determine Page Path (kebab-case)
        ├─ Check if Page Exists (WikiManager.getPage)
        ├─ Generate Documentation (DocumentationWriterAgent)
        │   ├─ Input: conceptName, analysis, existingContent
        │   └─ Output: markdown string
        └─ Create or Update Page (WikiManager)
            └─ Track: pagesCreated / pagesUpdated
    ↓
Return Commit Summary
```

### State Persistence Points

State is saved at these points to enable pause/resume:

1. **After Each Commit**: Saves current position and statistics
2. **After Meta-Analysis**: Saves analysis results and updated position
3. **On Cost Limit**: Marks status as 'paused', saves state
4. **On Completion**: Marks status as 'completed', final save

State file location: `.codewiki/state.json`

## Key Design Decisions

### Agent Specialization
Each agent has a focused responsibility with clear inputs/outputs. This allows:
- Independent prompt tuning
- Parallel development
- Easy testing with mocks
- Model selection per agent

### Incremental Processing
Process commits one at a time rather than batch analysis:
- State can be saved after each commit
- Pause/resume is trivial
- Errors don't lose all progress
- Human can step through manually

### Wiki as Markdown Files
Store documentation as plain markdown in git:
- Human-readable and editable
- Version controlled
- Tooling-independent
- Easy to deploy (GitHub Pages, etc.)

### Context Limitation
Limit related pages to ≤3 per file:
- Controls token usage and cost
- Forces relevance
- Keeps prompts focused
- Prevents information overload

### Test-Driven Development
Write tests before implementation:
- Documents expected behavior
- Enables refactoring confidence
- Catches regressions
- Proves features work

## Future Architecture

### MCP Server (Phase 3)
Expose wiki via Model Context Protocol:
- Claude Code can query documentation
- Provides targeted context vs. full code dump
- Request queue for missing documentation
- Metrics on documentation usage

### Parallel Processing (Future)
Independent files within a commit can be processed in parallel:
- Faster processing
- Better resource utilization
- Requires careful state management

## Testing Strategy

- **Unit Tests**: Each component tested in isolation with mocks
- **Integration Tests**: Full pipeline with test repository
- **Self-Validation**: Run generator on itself, verify wiki quality

## Dependencies

- **@anthropic-ai/sdk**: Claude API access
- **octokit**: GitHub API wrapper
- **express**: Web server
- **ejs**: Template engine
- **ws**: WebSocket support
- **dotenv**: Environment configuration
- **jest**: Testing framework

## Cost Control

AI API calls are the primary cost:
- Track tokens per request
- Accumulate daily total
- Estimate before processing
- Pause when approaching limit
- Truncate large diffs to save tokens
- Cache frequently accessed pages

## Error Handling

- API failures: Exponential backoff with retries
- Rate limits: Pause and wait
- Invalid responses: Log and skip file
- Disk errors: Alert user, attempt recovery
- State corruption: Validate on load, use backups

## Performance Targets

- 2-3 commits per minute
- <$0.05 per commit average
- <500ms dashboard response time
- Real-time WebSocket updates

## Security Considerations

- API keys never logged or committed
- Input validation on all user inputs
- Safe markdown rendering (XSS prevention)
- File path traversal protection
- Rate limiting on endpoints
