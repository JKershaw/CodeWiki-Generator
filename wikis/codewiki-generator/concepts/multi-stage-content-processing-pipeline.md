---
title: Multi-stage content processing pipeline
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-stage Content Processing Pipeline

## Purpose and Overview

The `Processor` module implements a two-phase content generation pattern for documentation: it first generates all documentation pages independently, then applies cross-cutting concerns like semantic linking in a separate pass. This architecture decouples content creation from relationship discovery, enabling a more sophisticated documentation system that builds an interconnected knowledge graph across pages.

## Key Functionality

The processor establishes a multi-stage pipeline with the following key operations:

**Content Generation Phase**
- Processes repository commits and file changes to determine which documentation pages need creation or updates
- Analyzes code context and significance to extract relevant information for each page
- Determines appropriate page paths and hierarchies within the documentation structure

**Cross-Page Linking Phase**
- Orchestrates linking via `addCrossLinksToAllPages()`, which iterates through all generated pages
- Uses `LinkDiscoveryAgent` to analyze page content and identify semantically related pages
- Injects discovered relationships into page metadata and adds inline hyperlinks via `documentationWriterAgent.addCrossLinks()`
- Populates the `related` field in page metadata with relationship scores and target pages

**Supporting Functions**
- `processCommit()` - Evaluates individual commits for documentation relevance
- `isSignificantFile()` - Filters files to identify those requiring documentation updates
- `getRelevantContext()` - Extracts contextual information needed for page generation
- `determinePagePath()` - Calculates the appropriate documentation hierarchy for each page

## Relationships

The processor integrates with multiple system components:

- **Wiki Manager** - Provides page I/O operations (`getAllPages()`, `writePage()`, `updatePageGlobalMetadata()`)
- **Link Discovery Agent** - Analyzes content to identify page relationships via `findRelatedPages()`
- **Documentation Writer Agent** - Injects cross-links into page content via `addCrossLinks()`
- **State Manager** - Tracks processing state across pipeline stages
- **Code Analysis Agent** - Extracts semantic information from source code

The `addCrossLinksToAllPages()` function is called after `generateWikiIndex()` in the main documentation generation flow, ensuring all pages exist before relationship discovery begins.

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor({
  wikiManager: wikiManagerInstance,
  stateManager: stateManagerInstance,
  codeAnalysisAgent: analysisAgentInstance,
  documentationWriterAgent: writerAgentInstance
});

// Phase 1: Generate pages from commits
await processor.processRepository(repositoryPath);

// Phase 2: Add cross-page linking
await processor.addCrossLinksToAllPages();
```

## Testing

The processor includes comprehensive test coverage across 26 test cases organized into 6 test suites:

- **Processor initialization and state management** - Validates proper setup of mock managers and agents
- **processCommit()** - Tests commit analysis and significance detection
- **isSignificantFile()** - Validates file filtering logic
- **getRelevantContext()** - Ensures correct context extraction
- **determinePagePath()** - Verifies page path calculation and hierarchy
- **processRepository()** - Integration tests for full repository processing

Tests are located in `tests/unit/processor.test.js` and use mocked dependencies to isolate processor logic from external systems.