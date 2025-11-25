---
title: WikiManager API consistency
category: component
sourceFile: lib/processor.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# WikiManager API Consistency

## Purpose and [Overview](../meta/overview.md)

The WikiManager API consistency component ensures that the processor uses the correct method names when interacting with the WikiManager. This addresses a critical bug where `writePage` was incorrectly called instead of `updatePage` when modifying existing pages with new content and metadata.

## Key Functionality

This component standardizes the API calls between the processor and WikiManager:

- **Method Correction**: Changes incorrect `writePage` calls to `updatePage` for semantic accuracy
- **API Alignment**: Ensures the processor uses the appropriate WikiManager methods based on the operation type
- **Consistency Enforcement**: Maintains proper separation between page creation and page updating operations

The fix ensures that when pages already exist and need content or metadata updates, the processor calls `updatePage` rather than attempting to write new pages, which aligns with the WikiManager's intended API design.

## Relationships

This component directly impacts:
- **WikiManager**: Receives the corrected method calls with proper semantic meaning
- **Processor**: Uses the standardized API methods for page operations
- **Page Processing Pipeline**: Benefits from consistent state management through proper API usage
- **Content Validation**: Works alongside other processor improvements to ensure robust page handling

## Usage Example

```javascript
describe('Processor', () => {
  let processor;
  let mockWikiManager;

  beforeEach(() => {
    mockWikiManager = {
      getPage: jest.fn(),
      createPage: jest.fn(),
      updatePage: jest.fn(),  // Correct method for updating existing pages
      searchPages: jest.fn(),
      getRelatedPages: jest.fn(),
      updatePageGlobalMetadata: jest.fn()
    };
    
    processor = new Processor(mockWikiManager, mockStateManager, agents);
  });
  
  // Test verifies updatePage is called instead of writePage
  // when modifying existing page content
});
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive testing of processor functionality including API method usage
- Test categories cover: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository operations