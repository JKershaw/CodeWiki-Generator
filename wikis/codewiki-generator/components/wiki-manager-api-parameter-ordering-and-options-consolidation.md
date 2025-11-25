---
title: WikiManager API parameter ordering and options consolidation
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# WikiManager API Parameter Ordering and Options Consolidation

## Purpose and Overview

The WikiManager API has been refactored to standardize parameter ordering and consolidate metadata handling through options objects. This change improves API consistency by making content a positional parameter while grouping metadata fields (including title) into an extensible options object structure.

## Key Functionality

**Parameter Standardization**: The `updatePage` and `createPage` methods now follow a consistent pattern where content is passed as a positional parameter, followed by an options object containing metadata fields like title and other page properties.

**Options Object Consolidation**: Metadata fields are consolidated into options objects, making the API more extensible for future metadata additions without breaking existing method signatures.

**Path Generation Enhancement**: The `determinePagePath` method now correctly includes `.md` file extensions in returned paths, ensuring consistent path handling throughout the system and matching documented behavior.

## Relationships

This component operates within the broader processor system, connecting to:

- **StateManager**: For tracking processing lifecycle states
- **Code Analysis Agents**: For content generation that feeds into the standardized API
- **Documentation Writers**: That utilize the consistent parameter structure
- **Path Resolution System**: That benefits from standardized path generation with proper file extensions

The refactored API provides a stable interface for all documentation generation workflows while maintaining backward compatibility through the options pattern.

## Usage Example

```javascript
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent
});

// Using the standardized API with content as positional parameter
// and metadata in options object
await processor.wikiManager.createPage(
  contentString, 
  { 
    title: 'Component Name',
    category: 'API Documentation',
    tags: ['refactoring', 'api-design']
  }
);

await processor.wikiManager.updatePage(
  updatedContent,
  { 
    title: 'Updated Component',
    lastModified: Date.now()
  }
);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Test categories include: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository
- Comprehensive mocking of WikiManager, StateManager, and agent dependencies