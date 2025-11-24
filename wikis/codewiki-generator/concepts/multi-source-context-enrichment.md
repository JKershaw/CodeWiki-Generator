---
title: Multi-Source Context Enrichment
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-Source Context Enrichment

## Purpose and Overview

The Multi-Source Context Enrichment pattern in the Processor integrates multiple data sources—including code analysis, code examples, and test coverage metrics—into a unified context object that guides documentation generation agents. This approach ensures that generated documentation is comprehensive, reliable, and informed by multiple perspectives on the codebase.

## Key Functionality

The Processor collects and synthesizes multiple types of analysis data during the documentation generation pipeline:

- **Test Coverage Analysis**: The `TestCoverageAnalyzer` class analyzes test coverage for source files and generates summaries that quantify code reliability and test status
- **Unified Context Assembly**: All analysis sources (code analysis results, code examples, test coverage summaries) are collected and passed together to generation agents
- **Dual Processing Paths**: Both page creation and page update flows incorporate enriched context, ensuring consistency across documentation lifecycle events
- **Agent Coordination**: The Processor initializes and coordinates multiple specialized agents (MetaAnalysisAgent, WikiIndexAgent, etc.) that each contribute different types of analysis

The enrichment process works by:

1. Analyzing the source file with code analysis tools
2. Extracting relevant code examples
3. Generating test coverage summaries via `TestCoverageAnalyzer.generateSummary()`
4. Combining all data into a metadata object
5. Passing enriched context to generation agents for guide creation

## Relationships

- **TestCoverageAnalyzer** is initialized in the Processor constructor alongside other analysis agents
- **Metadata Object** serves as the vehicle for passing enriched context, containing `filePath`, `codeExamples`, test coverage information, and code analysis results
- **Generation Agents** consume the enriched metadata to produce context-aware documentation
- **Processing Flow** applies enrichment consistently across both new page creation and existing page updates

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Processor initializes TestCoverageAnalyzer and other agents
const processor = new Processor(wikiManager, stateManager);

// During processing, multiple data sources are collected
// Test coverage is generated alongside other analysis
const testCoverageSummary = processor.testCoverageAnalyzer.generateSummary(filePath);

// All sources are combined into enriched metadata
const metadata = {
  filePath: 'lib/feature.js',
  codeExamples: [...],
  testCoverage: testCoverageSummary,
  analysis: {...}
};

// Enriched context is passed to generation agents
// This ensures documentation reflects test status, code examples, and analysis together
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- **26 test cases** across 6 test suites
- **Coverage areas**: Processor initialization, commit processing, file significance detection, context retrieval, path determination, and repository processing
- Test mocks demonstrate agent integration patterns for both WikiManager and StateManager components