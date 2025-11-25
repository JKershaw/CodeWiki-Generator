---
title: Contextual wiki retrieval
category: concept
sourceFile: lib/processor.js
related: [meta/overview.md, components/processor-class.md, concepts/file-significance-filtering.md]
created: 2025-11-25
updated: 2025-11-25
---

# Contextual Wiki Retrieval

## Purpose and [Overview](../meta/overview.md)

Contextual wiki retrieval is a pattern that extracts keywords from file paths to retrieve up to 3 related wiki pages as context for code analysis. This approach improves analysis quality by providing relevant documentation context to the analysis agents, enabling more informed and accurate documentation generation.

## Key Functionality

The contextual wiki retrieval system works by:

- **Keyword extraction**: Parsing file paths to identify meaningful terms that can be used for wiki searches
- **Related page lookup**: Using extracted keywords to search for and retrieve relevant existing wiki pages
- **Context limitation**: Restricting results to a maximum of 3 pages to maintain focused context without overwhelming the analysis agents
- **Analysis enhancement**: Providing the retrieved wiki context to code analysis agents so they can understand existing patterns and maintain consistency

This pattern enables the documentation system to build upon existing knowledge rather than analyzing code in isolation, leading to more coherent and contextually aware documentation updates.

## Relationships

Contextual wiki retrieval connects several key components:

- **[Processor class](../components/processor-class.md)**: Implements the retrieval logic as part of its commit processing workflow
- **WikiManager**: Provides the search and retrieval mechanisms for finding related pages
- **Code analysis agents**: Consume the retrieved context to inform their analysis and documentation decisions
- **[File significance filtering](../concepts/file-significance-filtering.md)**: Works in conjunction with filtering to ensure context is only retrieved for files that warrant documentation effort

## Usage Example

```javascript
describe('Processor', () => {
  let processor;
  let mockWikiManager;
  
  beforeEach(() => {
    mockWikiManager = {
      getPage: jest.fn(),
      createPage: jest.fn(),
      updatePage: jest.fn(),
      searchPages: jest.fn(),
      getRelatedPages: jest.fn(),
      updatePageGlobalMetadata: jest.fn()
    };
    
    // Initialize processor with wiki manager for contextual retrieval
    processor = new Processor(mockWikiManager, mockStateManager, agents);
  });
  
  // The processor uses contextual retrieval during commit processing
  // to gather relevant wiki context for analysis agents
});
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Tests include `getRelevantContext` suite specifically covering the contextual retrieval functionality
- Coverage includes processor initialization, commit processing, and context retrieval workflows