---
title: Code example extraction from test files
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Code Example Extraction from Test Files

## Purpose and Overview

The code example extraction component in `lib/processor.js` automatically discovers and extracts relevant code examples from test files to enhance documentation with accurate, maintainable examples. This bridges the gap between testing artifacts and documentation generation, ensuring that examples remain synchronized with the actual codebase.

## Key Functionality

The component implements an `extractCodeExamples()` method that:

- **Discovers test files** associated with components being documented
- **Extracts relevant code snippets** from test suites that demonstrate usage patterns
- **Enriches documentation** with real, tested code examples rather than manually written ones
- **Maintains accuracy** by sourcing examples directly from the test suite

The extraction process integrates into the broader documentation pipeline, where source file metadata and extracted examples are propagated through both update and create workflows. This ensures that documentation agents receive contextual code examples along with the primary source file information.

## Relationships

This component operates within the processor's documentation enrichment pipeline:

- **Integrates with** the main processor workflow for both updating existing and creating new documentation
- **Provides data to** documentation agents (DocWriterAgent) that consume the extracted examples
- **Coordinates with** WikiManager to include examples in page content
- **Works alongside** source file metadata tracking to create bidirectional links between code and documentation

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with required managers and agents
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Code examples are automatically extracted during processing
// and passed to documentation agents with source metadata
const result = await processor.processCommit(commitData);
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Comprehensive testing of processor functionality including `processCommit`, `isSignificantFile`, `getRelevantContext`, `determinePagePath`, and `processRepository`
- Mock implementations verify integration with WikiManager, StateManager, and various documentation agents