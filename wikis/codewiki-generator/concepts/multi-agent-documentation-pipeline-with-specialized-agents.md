---
title: Multi-agent documentation pipeline with specialized agents
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-agent documentation pipeline with specialized agents

## Purpose and Overview

The `lib/processor.js` module implements a multi-agent documentation pipeline that orchestrates specialized agents to analyze code and generate comprehensive documentation. It follows an agent-based architecture where each agent (CodeAnalysis, DocumentationWriter, MetaAnalysis, WikiIndex) handles a specific responsibility, enabling composable and maintainable documentation generation workflows.

## Key Functionality

The processor coordinates multiple specialized agents in sequence to transform code into structured documentation:

- **Agent Orchestration**: Manages the execution flow between CodeAnalysisAgent, DocumentationWriter, MetaAnalysis, and other specialized agents
- **Post-processing Index Generation**: Automatically generates wiki index pages after successful documentation creation, aggregating all generated pages with metadata for navigation
- **Conditional Completion Hooks**: Implements error-isolated completion hooks that only execute on successful processing, preventing optional features from disrupting the main workflow
- **State Management Integration**: Works with StateManager to track processing progress and WikiManager to handle page creation and updates
- **Context-aware Processing**: Determines relevant context, significant files, and appropriate page paths based on repository structure and commit changes

## Relationships

The processor acts as the central orchestrator connecting several key components:

- **WikiManager**: Interfaces for page creation, updates, and metadata management
- **StateManager**: Handles processing state persistence and recovery
- **Specialized Agents**: Coordinates CodeAnalysisAgent, DocumentationWriter, TechDebtAgent, and SecurityAgent
- **Repository Analysis**: Processes commits and file changes to determine documentation scope

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

// Process repository changes
await processor.processRepository(repositoryPath);

// Process specific commits
await processor.processCommit(commitData);
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Comprehensive coverage including: Processor initialization, processCommit workflow, isSignificantFile filtering, getRelevantContext retrieval, determinePagePath logic, and processRepository operations
- Tests validate agent coordination, error handling, and conditional completion hooks