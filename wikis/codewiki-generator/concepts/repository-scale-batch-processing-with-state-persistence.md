---
title: Repository-scale batch processing with state persistence
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Repository-scale batch processing with state persistence

## Purpose and Overview

The Processor component provides a system-wide pattern for processing entire repositories incrementally with checkpoint-based resumption capabilities. It shifts from single-commit processing to long-running batch operations that can pause and resume, while managing API costs and providing continuous meta-analysis insights.

## Key Functionality

- **Repository Processing**: Processes entire repositories by fetching commits via GitHub API integration and analyzing files incrementally
- **State Persistence**: Maintains processing state with checkpoints, enabling pause/resume functionality for long-running operations
- **Cost-Aware Management**: Tracks API usage costs and implements graceful throttling based on budget constraints
- **Periodic Meta-Analysis**: Runs high-level analysis at regular intervals to provide insights and documentation improvements
- **File Significance Detection**: Determines which files warrant processing based on type and content relevance
- **Context-Aware Processing**: Retrieves relevant existing documentation context to inform analysis decisions
- **Comprehensive Monitoring**: Tracks processing statistics including commits processed, files analyzed, pages created, and cost summaries

## Relationships

- **GitHubClient**: Depends on GitHub API integration for repository URL parsing and commit fetching
- **WikiManager**: Uses wiki management for page creation, updates, and metadata management
- **StateManager**: Integrates with state persistence for checkpoint-based processing resumption
- **Analysis Agents**: Coordinates with CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, and SecurityAgent for multi-faceted analysis
- **Processing Statistics**: Provides observability data for monitoring long-running batch operations

## Usage Example

```javascript
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Process individual commit
const result = await processor.processCommit(commitData, options);

// Process entire repository
const stats = await processor.processRepository(repositoryUrl, options);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive testing of core processing methods: `processCommit`, `isSignificantFile`, `getRelevantContext`, `determinePagePath`, and `processRepository`
- Full coverage of the main Processor class functionality including state management and cost tracking scenarios