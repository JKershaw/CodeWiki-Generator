---
title: Backward-compatible concept representation
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Backward-compatible concept representation

## Purpose and Overview

The backward-compatible concept representation component enables the processor to handle both legacy string-based concept formats and new object-based concept formats with category properties. This dual support allows for gradual migration to a category-aware documentation system without breaking existing implementations that rely on the original string format.

## Key Functionality

This component implements format detection and handling logic that:

- **Detects concept format**: Automatically identifies whether a concept is provided as a string (legacy) or object (new format)
- **Maintains API compatibility**: Ensures existing code using string concepts continues to work unchanged
- **Enables category routing**: Allows new object-format concepts to specify categories for proper documentation routing
- **Provides seamless transition**: Supports mixed usage where some concepts use the old format while others adopt the new structure

The implementation spans across `processConceptDocumentation` and `determinePagePath` methods, ensuring consistent handling throughout the documentation generation pipeline.

## Relationships

This component works closely with:

- **Category-based documentation routing**: Provides the concept format flexibility needed for the new routing system to categorize documentation into components/, concepts/, and guides/ directories
- **WikiManager**: Receives properly formatted concept data for page creation and updates
- **StateManager**: Stores concept information in a consistent format regardless of input type
- **Documentation agents**: Supply concept data in either format, with the component handling the differences transparently

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

// Legacy string format (backward compatible)
await processor.processConceptDocumentation('authentication-service');

// New object format with category
await processor.processConceptDocumentation({
  name: 'authentication-service',
  category: 'components'
});
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive coverage including `determinePagePath` method which handles the dual format logic
- Test categories: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository