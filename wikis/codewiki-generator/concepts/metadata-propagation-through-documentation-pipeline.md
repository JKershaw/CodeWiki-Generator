---
title: Metadata propagation through documentation pipeline
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Metadata Propagation Through Documentation Pipeline

## Purpose and Overview

This concept establishes a systematic pattern for tracking and passing file metadata throughout the documentation generation pipeline in `lib/processor.js`. It ensures that source file information and extracted code examples flow consistently through both documentation creation and update workflows, enabling more contextual and traceable documentation generation.

## Key Functionality

The metadata propagation system operates through several key mechanisms:

- **Source File Tracking** - Maintains `sourceFile` metadata throughout the documentation pipeline, providing clear provenance from code artifacts to generated documentation
- **Code Example Integration** - Automatically extracts relevant code examples from test files via the `extractCodeExamples()` method and includes them in the documentation context
- **Bidirectional Linking** - Creates connections between source code and documentation, allowing documentation agents to access both file context and practical examples
- **Pipeline Consistency** - Ensures metadata flows through both update and create paths in the documentation workflow

The system enriches documentation with contextual information by:
1. Extracting metadata from source files during processing
2. Discovering and parsing relevant test files for code examples  
3. Propagating this enriched context to wiki managers and documentation agents
4. Maintaining traceability throughout the documentation generation process

## Relationships

This concept integrates with several core components:

- **Wiki Manager** - Receives enriched metadata for page creation and updates via `createPage()` and `updatePage()` methods
- **Documentation Agents** - Code analysis, doc writer, tech debt, and security agents all receive the propagated metadata and examples
- **State Manager** - Works with the processor to maintain context across documentation workflows
- **Test Infrastructure** - Leverages existing test files as a source of accurate, maintainable code examples

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
    
    // Initialize processor with metadata-aware components
    processor = new Processor({
      wikiManager: mockWikiManager,
      stateManager: mockStateManager,
      codeAnalysisAgent: mockCodeAnalysisAgent,
      docWriterAgent: mockDocWriterAgent
    });
  });
});
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Comprehensive coverage of processor functionality including commit processing, file significance detection, context retrieval, page path determination, and repository processing
- Test categories: Processor, processCommit, isSignificantFile, getRelevantContext, determinePagePath, processRepository