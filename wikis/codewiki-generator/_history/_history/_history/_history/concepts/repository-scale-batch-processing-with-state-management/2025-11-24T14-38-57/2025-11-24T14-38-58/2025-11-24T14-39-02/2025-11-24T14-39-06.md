---
title: Repository-scale batch processing with state management
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Repository-scale Batch Processing with State Management

## Purpose and Overview

The Processor component enables automated documentation generation across entire GitHub repositories, processing commits sequentially while maintaining persistent state for resumable execution. It introduces cost-aware API consumption limits and periodic meta-analysis to prevent runaway expenses and derive insights from accumulated documentation during long-running batch operations.

## Key Functionality

**Repository Processing**: The `processRepository` function serves as the main entry point for batch operations. It:
- Fetches complete repository commit history via GitHubClient
- Iterates through commits, analyzing code and generating documentation for each
- Maintains cumulative cost tracking to enforce maximum API spending limits
- Persists progress state to enable resumable execution across process restarts
- Triggers periodic meta-analysis at configurable intervals to analyze accumulated documentation concepts

**Cost Tracking and Enforcement**: Cost awareness operates as a first-class constraint:
- Each processing step reports API costs to ClaudeClient
- Running total is compared against `maxCost` parameter
- Processing pauses when budget is exhausted, allowing controlled resumption
- Summary reports available via `getCostSummary()` for transparency

**State Management**: Long-running operations leverage StateManager for resilience:
- Saves progress after each commit to persistent storage
- Loads prior state on startup to resume from last processed commit
- Prevents reprocessing and ensures deterministic batch execution

**Meta-Analysis Integration**: MetaAnalysisAgent runs at configurable frequency to:
- Analyze accumulated documentation and concepts
- Derive cross-file insights and patterns
- Store analysis results for downstream usage and interpretation

## Relationships

- **CodeAnalysisAgent & DocumentationWriterAgent**: Orchestrated per-commit through inherited `processCommit` method
- **ClaudeClient**: Delegates cost monitoring and summary utilities for budget tracking
- **StateManager**: Enables resumable execution across process restarts
- **MetaAnalysisAgent**: Triggered periodically to analyze documentation progress
- **GitHubClient**: Parses repository URLs and fetches commit history before batch processing

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor({
  wikiManager: wikiManagerInstance,
  stateManager: stateManagerInstance,
  codeAnalysisAgent: analysisAgentInstance,
  documentationWriterAgent: writerAgentInstance,
  claudeClient: claudeClientInstance,
  githubClient: githubClientInstance,
  metaAnalysisAgent: metaAnalysisAgentInstance
});

// Process entire repository with cost limit and meta-analysis every 5 commits
await processor.processRepository(
  'https://github.com/owner/repo',
  { maxCost: 50, metaAnalysisFrequency: 5 }
);
```

## Testing

**Coverage**: 26 test cases across 6 test suites in `tests/unit/processor.test.js`

**Test Categories**:
- Processor initialization and configuration
- `processCommit` single-commit handling
- `isSignificantFile` filtering logic
- `getRelevantContext` context retrieval
- `determinePagePath` path resolution
- `processRepository` batch operations and state management

Tests validate cost tracking, state persistence, meta-analysis triggering, and repository integration patterns.