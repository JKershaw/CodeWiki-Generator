---
title: Processor class
category: component
sourceFile: lib/processor.js
related: [concepts/file-significance-filtering.md, meta/overview.md, concepts/commit-driven-documentation-pipeline.md, concepts/contextual-wiki-retrieval.md]
created: 2025-11-25
updated: 2025-11-25
---

# Processor Class

## Purpose and Overview

The Processor class serves as the central orchestrator in a commit-driven documentation pipeline, coordinating analysis agents and wiki management to automatically generate and update documentation based on code changes. It implements a concept-centric workflow where code commits are decomposed into discrete concepts, each maintained as independent documentation pages.

## Key Functionality

The Processor manages the complete documentation lifecycle through several core capabilities:

- **Commit Processing**: Analyzes git commits to identify significant files and extract meaningful changes for documentation
- **File Significance Filtering**: Applies filtering logic to skip binary files, deletions, and non-significant files, reducing documentation noise and focusing analysis on meaningful code changes
- **Context-Aware Documentation Generation**: Retrieves related wiki pages as context before analysis and determines appropriate documentation locations using semantic naming conventions (kebab-case concept-to-path mapping)
- **Agent Coordination**: Orchestrates multiple specialized agents (CodeAnalysisAgent, DocumentationWriterAgent, TechDebtAgent, SecurityAgent) in an agent-based architecture that enables modular, testable processing of code changes
- **Documentation Management**: Creates new concept pages or updates existing ones based on analysis results, maintaining a living documentation system

## Relationships

The Processor integrates with several key components:

- **WikiManager**: Handles wiki page creation, updates, searches, and metadata management through methods like `getPage`, `createPage`, `updatePage`, and `getRelatedPages`
- **StateManager**: Manages persistent state across documentation runs using `loadState` and state tracking functionality
- **Analysis Agents**: Coordinates with specialized agents for code analysis, documentation writing, technical debt assessment, and security review
- **Git Integration**: Processes commit data and file changes from version control systems

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with required managers and agents
const processor = new Processor({
  wikiManager: wikiManager,
  stateManager: stateManager,
  codeAnalysisAgent: codeAnalysisAgent,
  docWriterAgent: docWriterAgent,
  techDebtAgent: techDebtAgent,
  securityAgent: securityAgent
});

// Process a commit to generate/update documentation
await processor.processCommit(commitData);

// Process an entire repository
await processor.processRepository(repositoryPath);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive coverage including: main Processor functionality, commit processing workflow, file significance filtering, contextual wiki retrieval, page path determination, and repository processing
- Tests validate integration between WikiManager, StateManager, and agent components using comprehensive mocking strategies