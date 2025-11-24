---
title: Non-blocking error handling in documentation generation
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Non-blocking Error Handling in Documentation Generation

## Purpose and Overview

Non-blocking error handling ensures that failures in individual documentation generation stages (such as architecture overview synthesis) do not halt the entire pipeline. This resilience pattern allows partial documentation outputs to be generated successfully even when some components encounter errors, maintaining system robustness and providing incremental value to users.

## Key Functionality

The non-blocking error handling pattern in the documentation generation pipeline works by:

- **Isolating failures**: Errors that occur during architecture overview generation or other synthesis stages are caught and logged as warnings rather than propagated as exceptions
- **Continuing execution**: The processor continues executing subsequent documentation generation stages (guides, index generation) regardless of earlier failures
- **Logging for visibility**: Errors are recorded in a way that allows developers to diagnose issues without disrupting the documentation output
- **Partial completion**: The documentation pipeline completes with whatever outputs were successfully generated, providing incomplete but usable results

This approach is particularly valuable for the `generateArchitectureOverview` function, which depends on `WikiManager.getAllPages()` to retrieve and categorize content. Network timeouts, missing categorization metadata, or agent synthesis failures no longer cascade into complete pipeline failures.

## Relationships

- Follows the same error handling pattern used throughout the Processor for multi-stage documentation generation
- Integrates with `ArchitectureOverviewAgent` to safely execute system-level synthesis operations
- Works alongside `WikiManager` to gracefully handle issues retrieving or organizing wiki content
- Sequenced before guide and index generation, allowing those stages to proceed independently if architecture overview generation fails
- Complements existing agents (`DocumentationWriterAgent`, `MetaAnalysisAgent`, `WikiIndexAgent`, `GuideGenerationAgent`) which likely use similar patterns

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor(wikiManager, stateManager);

// During completion phase, architecture overview generation failures
// are caught and logged as warnings, allowing the pipeline to continue
await processor.processRepository(repositoryPath);

// If generateArchitectureOverview encounters an error:
// - The error is logged: console.warn('Architecture overview generation failed:', error)
// - Pipeline continues with guide and index generation
// - User receives partial documentation output
```

The non-blocking pattern ensures that transient failures (API timeouts, missing metadata) don't prevent documentation generation. Users still receive guides, indices, and other documentation components even if architecture synthesis fails.

## Testing

**Test Coverage**: 26 test cases across 6 test suites in `tests/unit/processor.test.js`

Test categories cover:
- Processor initialization and state management
- `processCommit` workflow
- File significance evaluation
- Context retrieval
- Page path determination
- Repository-level processing

These tests validate the overall processor pipeline behavior, including how it handles various inputs and edge cases that inform the non-blocking error handling strategy.