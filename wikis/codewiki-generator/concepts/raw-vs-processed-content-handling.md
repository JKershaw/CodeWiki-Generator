---
title: Raw vs processed content handling
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Raw vs Processed Content Handling

## Purpose and Overview

The raw vs processed content handling concept distinguishes between raw markdown content and processed HTML in wiki operations. This distinction is critical for proper wiki formatting, content preservation, and ensuring that markdown source remains intact during content analysis and manipulation workflows.

## Key Functionality

The system provides mechanisms to retrieve content in different formats depending on the use case:

- **Raw Content**: Returns unprocessed markdown text, preserving original formatting, syntax, and structure
- **Processed Content**: Returns HTML or other transformed content ready for display or consumption

The `getRawPage` function specifically retrieves raw markdown content from wiki pages instead of processed HTML, which is essential when the original markdown structure needs to be preserved or analyzed. This is particularly important for content analysis workflows where markdown syntax provides valuable context that would be lost in processed HTML.

## Relationships

- **WikiManager Integration**: Works closely with WikiManager for content retrieval operations
- **LinkDiscoveryAgent Workflow**: Forms a critical part of the LinkDiscoveryAgent process where raw markdown is needed for proper link analysis
- **Content Processing Pipeline**: Ensures proper wiki formatting is maintained throughout the documentation generation workflow

## Usage Example

```javascript
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent
});

// Mock setup for raw content retrieval
mockWikiManager.getPage = jest.fn();

// The processor handles raw vs processed content internally
// when working with wiki pages and content analysis
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Comprehensive testing of processor functionality including content handling
- Test categories cover: Processor, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository workflows