---
title: Context-aware code analysis
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Context-aware Code Analysis

## Purpose and Overview

Context-aware code analysis extracts relevant wiki context from file paths to provide code analyzers with related documentation as input. This system improves analysis quality by bridging code changes with existing knowledge base content, ensuring that code analysis agents have access to relevant documentation when processing files.

## Key Functionality

The context-aware analysis system performs several key operations:

- **Context Extraction**: Analyzes file paths and identifies related wiki pages that could provide relevant context for code analysis
- **Wiki Integration**: Retrieves existing documentation pages that relate to the code being analyzed, creating connections between code and documentation
- **Context Filtering**: Determines which documentation is most relevant to provide as input to code analysis agents
- **Knowledge Bridge**: Connects code changes with existing organizational knowledge stored in the wiki system

The system works by examining file paths, extracting meaningful identifiers, and querying the wiki for related pages that could inform the analysis process. This contextual information is then provided to code analysis agents to enhance their understanding of the codebase.

## Relationships

Context-aware code analysis integrates closely with several system components:

- **Processor Orchestration Class**: The processor uses context-aware analysis as part of its commit processing workflow
- **Code Analysis Agent**: Receives the extracted context as additional input to improve analysis accuracy
- **Wiki Manager**: Provides the interface for retrieving relevant documentation pages
- **Commit-driven Documentation Pipeline**: Forms part of the broader automated documentation generation system

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with required dependencies
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Context is automatically extracted during commit processing
const result = await processor.processCommit(commitData);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Tests cover context extraction methods including `getRelevantContext`
- Validates integration with processor orchestration and file significance determination
- Test categories include commit processing, file filtering, context retrieval, and page path determination