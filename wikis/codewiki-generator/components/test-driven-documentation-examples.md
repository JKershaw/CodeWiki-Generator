---
title: Test-driven documentation examples
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Test-driven Documentation Examples

## Purpose and Overview

This component automatically enriches generated documentation with practical code examples extracted from test files. By discovering and including test-based usage patterns directly in documentation, it ensures examples remain synchronized with actual implementation behavior and reduces the maintenance burden of keeping documentation current.

## Key Functionality

The processor implements two primary capabilities:

**Code Example Extraction**
- The `extractCodeExamples` function searches test files matching a given source file and extracts relevant code blocks
- Test discovery follows multiple location patterns (e.g., `tests/`, `__tests__/`, `.test.js` suffixes)
- Extracted examples are formatted as markdown code blocks for seamless documentation integration

**Source File Tracking**
- File path extraction logic determines source file locations from concept metadata or analysis data
- Defaults to "Not specified" when source information is unavailable
- Maintains sourceFile metadata throughout the documentation workflow

The processor enriches the documentation generation pipeline by passing additional context—including file paths and code examples—to the documentation writer agent, creating more contextual and actionable documentation.

## Relationships

- **Extends documentationWriterAgent**: Passes enriched context including `filePath` and `codeExamples` to documentation generation
- **Enhances wikiManager**: Tracks and persists `sourceFile` metadata during page creation and update operations
- **Complements analysis pipeline**: Grounds abstract analysis-based documentation with concrete implementation references

## Usage Example

```javascript
const processor = new Processor(mockWikiManager, mockStateManager, mockCodeAnalysisAgent, mockDocWriterAgent);

// Process a file and automatically extract test examples
const enrichedDoc = {
  filePath: 'lib/processor.js',
  codeExamples: processor.extractCodeExamples('lib/processor.js'),
  conceptName: 'Test-driven documentation examples'
};

// Pass to documentation writer with source awareness
await mockDocWriterAgent.call({ 
  concept: enrichedDoc,
  filePath: enrichedDoc.filePath,
  codeExamples: enrichedDoc.codeExamples
});
```

## Testing

Comprehensive test coverage is available in `tests/unit/processor.test.js`:

- **26 test cases** across **6 test suites**
- **Coverage areas**: 
  - Processor initialization and state management
  - `processCommit` functionality
  - `isSignificantFile` file filtering logic
  - `getRelevantContext` for documentation retrieval
  - `determinePagePath` path resolution
  - `processRepository` orchestration

The test suite validates mock integrations with wikiManager, stateManager, and both analysis and documentation agents, ensuring proper metadata flow and example extraction throughout the documentation generation pipeline.