---
title: Processor
category: components
created: 2025-11-22
updated: 2025-11-22
related:
  - github-integration
  - state-manager
  - wiki-manager
  - agents/overview
  - guides/processing-logic
---

# Processor

## Purpose and Overview

The `Processor` is the orchestration layer that coordinates all components to analyze a repository's git history and generate documentation. It manages the main processing loop, handles state persistence, enforces cost limits, and coordinates between the GitHub client, AI agents, and wiki manager.

## Key Functionality

### Repository Processing

The processor operates at two levels:

1. **Single Commit Processing** (`processCommit`): Analyzes one commit's file changes
2. **Repository Processing** (`processRepository`): Orchestrates processing all commits with state management and meta-analysis

### Processing Flow

```
Repository URL
    ↓
Parse & Fetch Commits (GitHub)
    ↓
Load State (resume or start fresh)
    ↓
FOR EACH Commit:
    ├─ Check Cost Limit
    ├─ Process Commit
    │   ├─ FOR EACH File:
    │   │   ├─ Check Significance
    │   │   ├─ Get Related Wiki Pages
    │   │   ├─ Analyze Code (CodeAnalysisAgent)
    │   │   ├─ Generate Docs (DocumentationWriterAgent)
    │   │   └─ Update Wiki (WikiManager)
    │   └─ Return Summary
    ├─ Save State
    └─ Check Meta-Analysis Trigger
        └─ Run MetaAnalysisAgent (if triggered)
            └─ Save State
    ↓
Mark Complete & Return Statistics
```

## Architecture

### Dependencies

The processor integrates six core components:

- **WikiManager**: Read/write documentation pages
- **StateManager**: Persist processing state
- **GitHubClient**: Fetch repository data
- **CodeAnalysisAgent**: Analyze code changes
- **DocumentationWriterAgent**: Generate markdown
- **MetaAnalysisAgent**: Identify patterns
- **ClaudeClient**: Track API costs

All dependencies are instantiated in the constructor and can be mocked for testing.

### State Management

The processor uses the StateManager to track:

```javascript
{
  repoUrl: string,           // Repository being processed
  currentCommit: number,     // Index of last processed commit
  totalCommits: number,      // Total commits to process
  status: string,            // 'idle', 'processing', 'paused', 'completed'
  lastMetaAnalysis: number,  // Commit index of last meta-analysis
  lastMetaAnalysisResults: Object // Most recent analysis
}
```

State is saved:
- After each commit (for resumability)
- After meta-analysis runs
- On completion
- On pause (cost limit reached)

## Method: processRepository()

The main orchestration method.

**Signature:**
```javascript
async processRepository(repoUrl, options = {})
```

**Parameters:**
- `repoUrl` (string): GitHub repository URL (https or ssh)
- `options.maxCost` (number): Maximum API cost in dollars (default: Infinity)
- `options.metaAnalysisFrequency` (number): Run meta-analysis every N commits (default: 5)

**Returns:** Processing summary object
```javascript
{
  commitsProcessed: number,
  totalFiles: number,
  filesProcessed: number,
  filesSkipped: number,
  pagesCreated: number,
  pagesUpdated: number,
  metaAnalysisRuns: number,
  stopped: boolean,
  stopReason: string | null,
  allConcepts: string[],
  allPages: string[],
  totalCost: number
}
```

**Process:**

1. **Load State**: Check if processing previously started
2. **Parse Repository**: Extract owner/repo from URL
3. **Fetch Commits**: Get all commits in chronological order
4. **Determine Start Point**:
   - Fresh start: Begin at commit 0
   - Resume: Start at `state.currentCommit`
5. **Process Loop**: For each commit:
   - Check cost limit before processing
   - Call `processCommit()` for the commit
   - Aggregate statistics
   - Save state
   - Trigger meta-analysis if at frequency interval
6. **Finalize**: Mark as completed or paused, return stats

## Method: processCommit()

Processes a single commit's file changes.

**Signature:**
```javascript
async processCommit(commit, state)
```

**Parameters:**
- `commit` (Object): Commit object from GitHub
  - `sha`: Commit hash
  - `message`: Commit message
  - `files`: Array of file changes with patches
- `state` (Object): Current processing state

**Returns:** Commit processing summary
```javascript
{
  commitSha: string,
  filesProcessed: number,
  filesSkipped: number,
  pagesCreated: number,
  pagesUpdated: number,
  concepts: string[]
}
```

**Process:**

1. **Filter Files**: Skip files without patches (deletions, binary files)
2. **Check Significance**: Skip insignificant files (config, tests, docs)
3. **Get Context**: Find up to 3 related wiki pages
4. **Analyze Code**: Call CodeAnalysisAgent with file diff and context
5. **Generate Documentation**: For each concept identified:
   - Check if page exists
   - Call DocumentationWriterAgent (with existing content if updating)
   - Create or update wiki page via WikiManager
6. **Return Summary**: Statistics for this commit

## File Significance

The processor delegates to `CodeAnalysisAgent.isSignificantFile()` to determine which files warrant documentation.

**Skipped:**
- Configuration files (package.json, tsconfig.json, .eslintrc.js)
- Lock files (package-lock.json, yarn.lock)
- Test files (*.test.js, *.spec.ts)
- Documentation (*.md)
- Build artifacts (dist/, build/)

**Documented:**
- Source code files (.js, .ts, .py, .java, .go, etc.)

## Context Retrieval

Before analyzing a file, the processor searches for related wiki pages using `getRelevantContext()`.

**Algorithm:**
1. Extract keywords from file path (e.g., `src/auth/service.js` → `auth`, `service`)
2. Search wiki for pages mentioning those keywords
3. Return up to 3 most relevant pages
4. Pass to CodeAnalysisAgent as context

This helps the agent:
- Use consistent terminology
- Reference existing documentation
- Avoid duplicating information

## Page Path Determination

The processor converts concept names to wiki page paths using `determinePagePath()`.

**Transformation:**
- CamelCase → kebab-case
- Spaces → dashes
- Lowercase
- Prefix with `components/`

**Examples:**
- `AuthService` → `components/auth-service`
- `UserAuthenticationManager` → `components/user-authentication-manager`
- `Session Manager` → `components/session-manager`

## Cost Control

To prevent runaway API expenses, the processor checks costs before each commit:

```javascript
const costSummary = this.claudeClient.getCostSummary();
if (costSummary.totalCost >= maxCost) {
  stats.stopped = true;
  stats.stopReason = 'cost_limit';
  state.status = 'paused';
  await this.stateManager.saveState(state);
  break;
}
```

When the limit is reached:
- Processing stops immediately
- State is saved as 'paused'
- Can be resumed later with increased limit

## Meta-Analysis Integration

Every N commits (default: 5), the processor triggers meta-analysis:

```javascript
if (this.metaAnalysisAgent.shouldRunMetaAnalysis(
  state.currentCommit,
  state.lastMetaAnalysis
)) {
  const analysis = await this.metaAnalysisAgent.analyzeProgress(
    stats.allConcepts,
    stats.allPages
  );

  state.lastMetaAnalysis = state.currentCommit;
  state.lastMetaAnalysisResults = analysis;
}
```

The analysis identifies:
- Emerging architectural themes
- Suggestions for new high-level pages
- Documentation gaps
- Reorganization opportunities

Results are stored in state for potential future use (e.g., presenting recommendations to users).

## Resume Capability

The processor can pause and resume processing across runs:

**Pause Scenarios:**
- Cost limit reached
- Manual interruption (future feature)
- API rate limits (though GitHubClient retries)

**Resume Process:**
1. Load state from disk
2. Verify same repository URL
3. Start processing from `state.currentCommit`
4. Continue until completion or next pause

**Example:**
```
Run 1: Process commits 0-49, hit cost limit
Run 2: Resume from commit 50, process 50-99
Run 3: Resume from commit 100, complete remaining
```

## Error Handling

The processor propagates errors from underlying components:

- **GitHub API Errors**: GitHubClient handles retries, processor fails if exhausted
- **Claude API Errors**: Agents handle retries, processor fails if exhausted
- **File System Errors**: WikiManager and StateManager throw, processor fails

No specific error recovery is implemented - failures should be investigated and resolved before retrying.

## Testing

The processor has 26 comprehensive tests:

**processCommit (8 tests):**
- Single and multiple file processing
- File filtering and significance
- Wiki context retrieval
- Page creation and updates
- Error handling
- Processing summaries

**isSignificantFile (5 tests):**
- Identifying significant files
- Skipping config, tests, docs, locks

**getRelevantContext (3 tests):**
- Returning up to 3 pages
- Handling fewer pages
- Empty results

**determinePagePath (3 tests):**
- CamelCase conversion
- Multi-word concepts
- Space handling

**processRepository (7 tests):**
- Sequential commit processing
- Meta-analysis triggering
- State persistence
- Resume functionality
- Cost limit enforcement
- Processing statistics
- API rate limit handling

All tests use mocked dependencies to avoid real API calls.

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor('./output-wiki');

// Process entire repository
const stats = await processor.processRepository(
  'https://github.com/owner/repo',
  {
    maxCost: 5.00,              // Stop at $5
    metaAnalysisFrequency: 10   // Analyze every 10 commits
  }
);

console.log(`Processed ${stats.commitsProcessed} commits`);
console.log(`Created ${stats.pagesCreated} pages`);
console.log(`Updated ${stats.pagesUpdated} pages`);
console.log(`Total cost: $${stats.totalCost.toFixed(2)}`);

if (stats.stopped) {
  console.log(`Stopped: ${stats.stopReason}`);
  console.log('Can resume later with increased limit');
}
```

## Design Rationale

**Why separate processCommit and processRepository?**
- processCommit is unit-testable in isolation
- processRepository coordinates cross-commit concerns (state, meta-analysis)
- Clear separation of concerns

**Why save state after every commit?**
- Minimizes lost work on interruption
- Enables incremental processing
- Small overhead compared to AI API calls

**Why check cost limit before each commit?**
- Prevents exceeding budget mid-commit
- Commit-level granularity sufficient (vs file-level)
- Simpler implementation

**Why fixed meta-analysis frequency?**
- Simple and predictable
- User can adjust based on project size
- Future: Could use commit activity heuristics

**Why integrate all components in constructor?**
- Dependency injection for testing
- Clear component boundaries
- All dependencies visible upfront
