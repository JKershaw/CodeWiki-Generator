---
title: Processor class
category: component
sourceFile: lib/processor.js
related: [concepts/file-significance-filtering.md, meta/overview.md, concepts/commit-driven-documentation-pipeline.md, concepts/contextual-wiki-retrieval.md]
created: 2025-11-25
updated: 2025-11-25
---

# Processor Class

## Purpose and [Overview](../meta/overview.md)

The Processor class serves as the central orchestrator in a [commit-driven documentation pipeline](../concepts/commit-driven-documentation-pipeline.md), coordinating analysis agents and wiki management to automatically generate and update documentation based on code changes. It implements a concept-centric workflow where code commits are decomposed into discrete concepts, each maintained as independent documentation pages.

## Key Functionality

The Processor manages the complete documentation lifecycle through several core capabilities:

- **Commit Processing**: Analyzes git commits to identify significant files and extract meaningful changes for documentation
- **[File Significance Filtering](../concepts/file-significance-filtering.md)**: Applies filtering logic to skip non-significant files and those without patches, reducing documentation noise
- **Contextual Analysis**: Retrieves up to 3 related wiki pages using keywords extracted from file paths to provide context for code analysis
- **Agent Coordination**: Orchestrates multiple specialized agents (CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, SecurityAgent) to analyze different aspects of code changes
- **Documentation Management**: Creates new concept pages or updates existing ones based on analysis results, maintaining a living documentation system

## Relationships

The Processor integrates with several key components:

- **WikiManager**: Handles wiki page creation, updates, searches, and metadata management
- **StateManager**: Manages persistent state across documentation runs
- **Analysis Agents**: Coordinates with specialized agents for code analysis, documentation writing, technical debt assessment, and security review
- **Git Integration**: Processes commit data and file changes from version control

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

// Process a commit to generate/update documentation
await processor.processCommit(commitData);

// Process an entire repository
await processor.processRepository(repositoryPath);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive coverage including: main Processor functionality, commit processing workflow, [file significance filtering](../concepts/file-significance-filtering.md), [contextual wiki retrieval](../concepts/contextual-wiki-retrieval.md), page path determination, and repository processing
- Tests validate integration between WikiManager, StateManager, and agent components