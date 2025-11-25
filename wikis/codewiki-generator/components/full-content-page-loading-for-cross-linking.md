---
title: Full-content page loading for cross-linking
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Full-content page loading for cross-linking

## Purpose and Overview

This component implements a critical fix for the page processing workflow in `lib/processor.js` that ensures full page content is loaded before performing link discovery and cross-linking operations. It addresses a bug where only metadata was initially loaded, preventing proper link detection and content modification processes.

## Key Functionality

- **Two-stage loading pattern**: First loads page metadata, then explicitly loads full page content (title and content fields) required for link discovery
- **Correct processing order**: Ensures link detection operates on original content before any modifications are made, preventing incorrect or duplicate link detection
- **Content validation**: Includes defensive checks to skip pages without content, preventing null reference errors during batch processing
- **API consolidation**: Uses `updatePage` method instead of `writePage` for more semantically correct updates to existing pages

## Relationships

This component integrates with several key system components:

- **WikiManager**: Uses `getPage` for loading content and `updatePage` for persisting changes
- **StateManager**: Coordinates with state loading operations
- **Analysis Agents**: Provides properly loaded content to CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, and SecurityAgent
- **Link Discovery Workflow**: Ensures proper sequencing of content loading before link detection processes

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

// The processor now ensures full content loading
await processor.processCommit(commitData);
await processor.processRepository(repositoryPath);
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Comprehensive testing of core processor functionality including `processCommit`, `isSignificantFile`, `getRelevantContext`, `determinePagePath`, and `processRepository`
- Mock implementations verify proper integration with WikiManager API methods including `getPage`, `createPage`, `updatePage`, and related metadata operations