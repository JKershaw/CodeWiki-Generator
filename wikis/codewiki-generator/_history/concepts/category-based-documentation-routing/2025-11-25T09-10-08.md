---
title: Category-based documentation routing
category: concept
sourceFile: lib/processor.js
related: [meta/overview.md, components/code-analysis-agent.md, components/documentation-writer-agent.md]
created: 2025-11-25
updated: 2025-11-25
---

# Category-based Documentation Routing

## Purpose and [Overview](../meta/overview.md)

Category-based documentation routing enables the processor to organize documentation into different directories (components/, concepts/, guides/) based on category properties rather than a flat structure. This architectural enhancement allows for flexible documentation organization while maintaining backward compatibility with existing string-based concept names.

## Key Functionality

The processor implements category-aware routing that:

- **Routes documentation by category**: Directs concept documentation to appropriate directories based on category metadata
- **Maintains backward compatibility**: Accepts both legacy string concept names and new object format with name and category properties
- **Enables flexible organization**: Supports different documentation types (components, concepts, guides) in their respective directories
- **Preserves existing functionality**: Legacy code continues to work without modification while new code can leverage enhanced categorization

The dual-format handling allows functions to process either simple string concept names or rich concept objects containing both name and category information, enabling gradual migration to the enhanced format.

## Relationships

This component integrates with several system components:

- **Wiki Manager**: Receives categorized routing decisions for page creation and updates
- **State Manager**: Stores and retrieves category-based organization state
- **[Code Analysis Agent](../components/code-analysis-agent.md)**: Provides concept categorization during code analysis
- **[Documentation Writer Agent](../components/documentation-writer-agent.md)**: Uses category information for appropriate content generation

The processor serves as the central routing hub, coordinating between analysis agents and the wiki management system.

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
      loadState: jest.fn()
    };
    // Additional agent initialization...
  });
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Test categories include: Processor, processCommit, isSignificantFile, getRelevantContext, determinePagePath, processRepository
- Comprehensive coverage of category-based routing functionality and backward compatibility scenarios