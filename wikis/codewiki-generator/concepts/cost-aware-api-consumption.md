---
title: Cost-aware API consumption
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Cost-aware API consumption

## Purpose and Overview

The Processor module manages cost-aware, repository-scale batch processing with built-in budget constraints and state management. It enables long-running documentation generation across entire GitHub repositories while tracking API costs in real-time and preventing runaway spending through configurable budget limits.

## Key Functionality

The Processor implements several interconnected capabilities:

**Repository-scale batch processing**: The `processRepository` function serves as the main entry point, orchestrating commit-by-commit analysis across an entire GitHub repository. It manages iteration through commit history, delegates per-commit processing to CodeAnalysisAgent and DocumentationWriterAgent, and maintains cumulative progress.

**Cost tracking and enforcement**: Built on top of Claude API integration, the processor monitors cumulative API costs throughout batch operations. The `maxCost` parameter establishes a hard budget limit, and cost summaries are retrieved via `ClaudeClient.getCostSummary()` to prevent exceeding allocated budgets. Processing pauses when cost limits are approached, enabling controlled resumption.

**State persistence and resumability**: Integration with StateManager enables batch operations to survive process interruptions. State is saved incrementally during processing and reloaded on restart, allowing continuation from the last completed commit rather than restarting from the beginning.

**Periodic meta-analysis**: The processor triggers MetaAnalysisAgent at configurable intervals (`metaAnalysisFrequency`) to analyze accumulated documentation concepts and derive insights from batch progress without interrupting the main processing workflow.

**GitHub integration**: GitHubClient parses repository URLs and fetches commit history before batch processing begins, establishing direct integration with GitHub's data model.

## Relationships

- `processRepository` orchestrates per-commit analysis by inheriting and invoking the `processCommit` method for each commit in the repository
- Cost monitoring is delegated to `ClaudeClient.getCostSummary()` to track cumulative API expenses
- `StateManager` persists progress state to enable resumable execution across process restarts
- `MetaAnalysisAgent` runs periodically during batch processing to analyze accumulated documentation concepts
- `GitHubClient` provides repository data retrieval before batch processing initialization

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor({
  wikiManager: wikiManagerInstance,
  stateManager: stateManagerInstance,
  claudeClient: claudeClientInstance,
  githubClient: githubClientInstance,
  metaAnalysisAgent: metaAnalysisAgentInstance
});

await processor.processRepository({
  repositoryUrl: 'https://github.com/owner/repo',
  maxCost: 50.00,
  metaAnalysisFrequency: 10,
  resumeFromState: true
});
```

## Testing

The component has comprehensive test coverage with **26 test cases** organized across **6 test suites** in `tests/unit/processor.test.js`. Test categories include:

- Processor initialization and configuration
- `processCommit` behavior and agent delegation
- `isSignificantFile` filtering logic
- `getRelevantContext` retrieval
- `determinePagePath` routing
- `processRepository` batch operation orchestration including cost tracking and state management

All tests verify correct delegation to dependent agents, proper state handling, and accurate cost tracking throughout batch processing workflows.