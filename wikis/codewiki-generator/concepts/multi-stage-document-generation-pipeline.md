---
title: Multi-stage document generation pipeline
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-stage Document Generation Pipeline

## Purpose and Overview

The multi-stage document generation pipeline establishes a sequential processing pattern for generating and connecting wiki documentation. It separates core document generation from relationship discovery, enabling comprehensive cross-linking after all pages have been created.

## Key Functionality

The pipeline operates in distinct stages:

1. **Document Generation Stage**: Processes code changes and generates individual wiki pages using various specialized agents (CodeAnalysis, DocWriter, TechDebt, Security)

2. **Cross-linking Stage**: After all pages exist, discovers relationships between pages and establishes hyperlinks and metadata connections

3. **File Processing**: Determines significant files, extracts relevant context, and maps files to appropriate documentation pages

4. **State Management Integration**: Maintains processing state across pipeline stages and coordinates with wiki management systems

The processor handles commit-level changes and repository-wide processing, ensuring comprehensive documentation coverage while maintaining relationship integrity.

## Relationships

- **WikiManager**: Interfaces for page creation, updates, searching, and metadata management
- **StateManager**: Provides persistence and state coordination across processing stages  
- **LinkDiscoveryAgent**: New agent type specifically for identifying related pages and recommending connections
- **Processing Agents**: Integrates with CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, and SecurityAgent for specialized content generation
- **Cross-page Linking System**: Implements the post-generation phase that connects related documentation

## Usage Example

```javascript
// Basic processor setup with required dependencies
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Process a commit through the pipeline
await processor.processCommit(commitData);

// Process entire repository
await processor.processRepository(repoPath);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Covers: Processor initialization, commit processing, file significance detection, context extraction, page path determination, and repository-wide processing
- Validates integration with WikiManager, StateManager, and all processing agents