---
title: Source-aware documentation enrichment
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Source-aware Documentation Enrichment

## Purpose and Overview

Source-aware documentation enrichment automatically enhances documentation by embedding metadata about source files and extracting relevant code examples from test files. This creates a bidirectional relationship between code artifacts and their documentation, enabling more contextual and example-driven documentation generation.

## Key Functionality

**Code Example Extraction**: The `extractCodeExamples()` method automatically discovers and extracts examples from test files, ensuring documentation includes accurate, maintainable code samples that stay synchronized with the actual codebase.

**Metadata Propagation**: Throughout the documentation pipeline, source file metadata (`sourceFile` and `codeExamples`) is systematically tracked and propagated to documentation agents and wiki managers, maintaining provenance of where documentation content originated.

**Bidirectional Linking**: Establishes connections between code files and their generated documentation, allowing for automated updates when source code changes and enabling richer context for documentation consumers.

## Relationships

**Processor Integration**: Integrates with the main processor workflow in both update and create documentation paths, ensuring all generated documentation carries source metadata.

**Wiki Manager Coordination**: Works with wiki managers to store and retrieve source-aware documentation pages, enabling cross-referencing between related code files and their documentation.

**Agent Pipeline**: Provides enriched context to documentation agents (CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, SecurityAgent) by including source file paths and extracted examples in the processing pipeline.

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

// Process a file with source-aware enrichment
await processor.processCommit({
  filePath: 'src/component.js',
  content: fileContent,
  operation: 'modified'
});
```

## Testing

**Test Coverage**: Comprehensive test suite in `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Tests cover core processor functionality including `processCommit`, `isSignificantFile`, `getRelevantContext`, `determinePagePath`, and `processRepository`
- Full mock integration testing with wiki managers, state managers, and documentation agents