---
title: Source-aware documentation enrichment
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Source-aware Documentation Enrichment

## Purpose and Overview

Source-aware documentation enrichment automatically augments generated documentation with metadata about source file locations and extracted code examples from test files. This pattern ensures documentation remains contextually grounded in actual implementation, providing developers with direct links to source files and practical usage patterns without requiring manual example maintenance.

## Key Functionality

The processor enriches documentation through two primary mechanisms:

**File Path Tracking**
- Automatically extracts and preserves source file paths from concept metadata or code analysis data
- Falls back to 'Not specified' when path information is unavailable
- Tracks sourceFile across both page creation and update operations within the wiki management system

**Test-Driven Code Examples**
- `extractCodeExamples()` function searches test files matching a source file's pattern
- Discovers practical usage examples from test suites automatically
- Formats extracted examples as markdown code blocks for direct inclusion in documentation
- Supports multiple test file location patterns to accommodate various project structures

The enrichment process integrates seamlessly into the documentation generation pipeline, passing additional context (filePath, codeExamples) to the documentationWriterAgent for comprehensive output.

## Relationships

- **Extends documentationWriterAgent integration** — Provides additional context parameters enabling richer documentation generation
- **Enhances wikiManager metadata** — Maintains sourceFile tracking throughout page creation and update workflows
- **Complements analysis-based generation** — Adds concrete implementation references to abstract documentation patterns

## Usage Example

```javascript
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent
});

// Documentation enrichment occurs automatically during processing
// Source file paths are extracted from concept metadata
const enrichedDocs = processor.processRepository({
  sourceFile: 'lib/processor.js',
  concept: 'Source-aware documentation enrichment'
});

// Result includes both source file path and extracted test examples
// {
//   content: '...',
//   sourceFile: 'lib/processor.js',
//   codeExamples: ['...extracted from tests...']
// }
```

## Testing

Comprehensive test coverage validates the enrichment workflow:

- **26 test cases** organized across **6 test suites** in `tests/unit/processor.test.js`
- Test categories cover: Processor initialization, processCommit flow, isSignificantFile detection, getRelevantContext retrieval, determinePagePath logic, and processRepository orchestration
- Mock implementations verify integration points with wikiManager, stateManager, codeAnalysisAgent, and docWriterAgent
- Test suite validates sourceFile metadata persistence and code example extraction accuracy