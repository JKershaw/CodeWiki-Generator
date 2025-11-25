---
title: Processor orchestration class
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Processor Orchestration Class

## Purpose and Overview

The Processor orchestration class serves as the central coordinator for the commit-driven documentation pipeline. It orchestrates the analysis of code commits and automatically generates or updates wiki documentation by coordinating specialized agents and managing the overall workflow.

## Key Functionality

The Processor implements the core business logic for transforming code commits into documentation:

- **Commit Processing**: Analyzes incoming commits to identify significant file changes and extract relevant code concepts
- **Agent Coordination**: Delegates specialized tasks to CodeAnalysisAgent, DocumentationWriterAgent, TechDebtAgent, and SecurityAgent
- **Context Integration**: Extracts relevant wiki context from file paths to provide analyzers with existing documentation as input
- **Page Management**: Converts identified code concepts into wiki pages using kebab-case naming conventions and category-based organization
- **Repository Processing**: Handles full repository analysis for comprehensive documentation generation

## Relationships

The Processor acts as the central hub connecting multiple system components:

- **WikiManager**: Interfaces with for page creation, updates, and retrieval of related documentation
- **StateManager**: Manages processing state and persistence across runs  
- **Analysis Agents**: Coordinates CodeAnalysisAgent, TechDebtAgent, and SecurityAgent for specialized code analysis
- **DocumentationWriterAgent**: Delegates documentation generation and formatting tasks
- **File System**: Processes file changes and determines documentation relevance

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize with required managers and agents
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager, 
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Process a commit
await processor.processCommit(commitData);

// Process entire repository
await processor.processRepository(repositoryPath);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive coverage including: main Processor functionality, commit processing, file significance detection, context retrieval, page path determination, and repository processing workflows