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
The main orchestration engine:
- Walks through commits sequentially
- Determines which files are significant
- Coordinates AI agents
- Manages state persistence
- Triggers meta-analysis periodically
- Enforces cost limits

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

### Processing a Single Commit

1. **Fetch**: Get commit data from GitHub
2. **Filter**: Determine if files are significant (ignore configs, deps)
3. **Contextualize**: Find ≤3 related wiki pages for each file
4. **Analyze**: Call Code Analysis Agent with diff + context
5. **Document**: Call Documentation Writer Agent with analysis
6. **Persist**: Save wiki pages via Wiki Manager
7. **Update**: Increment state, broadcast progress
8. **Meta-analyze**: Every 5 commits, look for themes

### Processing a Repository

1. Load or initialize state
2. Fetch commit list from GitHub
3. For each unprocessed commit:
   - Process commit (see above)
   - Save state
   - Check cost limits
   - Respect pause flag
4. Generate final meta-analysis
5. Save complete state

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
