---
title: Full-page content loading for link discovery
category: component
sourceFile: lib/processor.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Full-page Content Loading for Link Discovery

## Purpose and [Overview](../meta/overview.md)

The full-page content loading component in the processor ensures that complete page content is available before performing link discovery operations. This addresses a critical bug where only page metadata was being loaded, preventing accurate detection of cross-references that require access to both page titles and full content.

## Key Functionality

This component performs several critical operations:

- **Complete Content Loading**: Explicitly fetches full page objects instead of just metadata, iterating through all pages to ensure content availability
- **Correct Processing Order**: Establishes proper semantic ordering by detecting related pages from original content BEFORE modifying it with inline links
- **Content Validation**: Implements defensive programming by checking for empty or missing content before processing pages
- **API Consistency**: Uses the correct `updatePage` method for WikiManager operations instead of `writePage`

The component prevents link discovery from operating on already-modified content, which would produce incorrect cross-reference results.

## Relationships

This component integrates with several system components:

- **WikiManager**: Uses `getPage`, `updatePage`, `searchPages`, and `getRelatedPages` methods
- **StateManager**: Coordinates with state loading operations
- **Analysis Agents**: Works with CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, and SecurityAgent
- **Link Discovery System**: Provides the foundation for accurate cross-page linking

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with required dependencies
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// The processor handles full-page loading internally during operations
await processor.processCommit(commitData);
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Test categories include: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository
- Comprehensive mocking of WikiManager, StateManager, and analysis agents