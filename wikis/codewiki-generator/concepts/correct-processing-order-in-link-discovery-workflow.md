---
title: Correct processing order in link discovery workflow
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Correct Processing Order in Link Discovery Workflow

## Purpose and Overview

This concept ensures that link discovery operations occur on original page content before any modifications are applied during the documentation processing workflow. This prevents the link discovery agent from operating on already-modified content, which could cause incorrect or duplicate link detection and compromise the integrity of cross-references between pages.

## Key Functionality

The workflow establishes a strict processing order:

1. **Full Content Loading**: Pages are loaded with complete content (title and content fields) rather than just metadata
2. **Link Discovery First**: Link detection runs on the original, unmodified page content
3. **Content Modification**: Page content is then processed and modified by other agents
4. **Link Addition**: Discovered links are added after content modifications are complete

This two-stage approach separates link detection from content modification, ensuring that cross-linking analysis is performed on clean, original content. The workflow also includes defensive validation to skip pages without content, preventing null reference errors during batch processing operations.

## Relationships

This concept coordinates with several key components:

- **WikiManager**: Uses the `updatePage` method for semantically correct page updates rather than `writePage`
- **Full-content Page Loading**: Depends on complete page data being available before processing begins
- **Page Content Validation**: Works with validation checks to ensure robust batch processing
- **Link Discovery Agents**: Provides clean, original content for accurate link detection
- **Content Modification Agents**: Receives properly sequenced workflow to prevent interference with link discovery

## Usage Example

```javascript
describe('Processor', () => {
  let processor;
  let mockWikiManager;
  let mockStateManager;
  let mockCodeAnalysisAgent;
  let mockDocWriterAgent;
  let mockTechDebtAgent;
  let mockSecurityAgent;

  beforeEach(() => {
    // Create mock managers and agents
    mockWikiManager = {
      getPage: jest.fn(),
      createPage: jest.fn(),
      updatePage: jest.fn(),
      searchPages: jest.fn(),
      getRelatedPages: jest.fn(),
      updatePageGlobalMetadata: jest.fn()
    };

    mockStateManager = {
      loadState: jest.fn(),
      // Additional state management methods
    };

    // Initialize processor with correct workflow ordering
    processor = new Processor({
      wikiManager: mockWikiManager,
      stateManager: mockStateManager,
      agents: {
        codeAnalysis: mockCodeAnalysisAgent,
        docWriter: mockDocWriterAgent,
        techDebt: mockTechDebtAgent,
        security: mockSecurityAgent
      }
    });
  });
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Test categories: Processor, processCommit, isSignificantFile, getRelevantContext, determinePagePath, processRepository
- Validates correct processing order and workflow sequencing