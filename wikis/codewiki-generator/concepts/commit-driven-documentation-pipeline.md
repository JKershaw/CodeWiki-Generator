---
title: Commit-driven documentation pipeline
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Commit-driven Documentation Pipeline

## Purpose and Overview

The `Processor` class orchestrates an automated documentation pipeline that analyzes code commits, extracts meaningful architectural concepts, and updates a wiki with relevant documentation. It bridges version control systems and knowledge management by delegating code analysis and documentation generation to specialized agents, ensuring that documentation stays synchronized with codebase evolution.

## Key Functionality

The processor follows a multi-stage workflow:

**Commit Processing**
- `processCommit()` analyzes all files in a commit and filters for significant changes
- Only files with actual patches and architectural significance are processed
- Extracts concepts from changed code using the CodeAnalysisAgent

**Concept Documentation Lifecycle**
- `processConceptDocumentation()` handles individual concept documentation
- Checks for existing wiki pages and decides whether to create or update
- Preserves prior documentation context while integrating new information
- Tracks metrics on created vs. updated pages

**Contextual Integration**
- `getRelevantContext()` extracts keywords from file paths and retrieves related wiki pages
- Provides contextual information to agents, ensuring new documentation builds on existing knowledge
- Enables the DocumentationWriterAgent to write comprehensive, interconnected documentation

**File Significance Filtering**
- `isSignificantFile()` delegates to the CodeAnalysisAgent to determine documentation worthiness
- Prevents documentation effort on trivial changes (test files, minor fixes, configuration tweaks)
- Ensures focus on architecturally relevant changes

**Wiki Organization**
- `determinePagePath()` standardizes wiki structure by converting concept names to kebab-case paths
- All documentation lives under a `components/` hierarchy for consistent discovery and organization

## Relationships

The Processor coordinates multiple components:

- **WikiManager**: Provides page CRUD operations (create, read, update) and content discovery via `getRelatedPages()`
- **CodeAnalysisAgent**: Evaluates file significance and extracts concepts from code changes
- **DocumentationWriterAgent**: Generates or updates wiki page content based on analysis results
- **StateManager**: Tracks pipeline execution state (initialized but not actively used in base implementation)

## Usage Example

```javascript
const Processor = require('./lib/processor');
const WikiManager = require('./lib/wiki-manager');
const CodeAnalysisAgent = require('./lib/agents/code-analysis-agent');
const DocumentationWriterAgent = require('./lib/agents/documentation-writer-agent');

// Initialize dependencies
const wikiManager = new WikiManager(config);
const codeAnalysisAgent = new CodeAnalysisAgent();
const docWriterAgent = new DocumentationWriterAgent();

// Create processor with agents
const processor = new Processor({
  wikiManager,
  codeAnalysisAgent,
  docWriterAgent
});

// Process a commit with changed files
const result = await processor.processCommit({
  files: [
    { path: 'lib/processor.js', patch: '...' },
    { path: 'lib/wiki-manager.js', patch: '...' }
  ]
});

console.log(`Created: ${result.created}, Updated: ${result.updated}`);
```

## Testing

The Processor has comprehensive test coverage with **26 test cases** across **6 test suites** in `tests/unit/processor.test.js`:

- **Processor suite**: Initialization and basic functionality
- **processCommit suite**: Commit analysis and file filtering logic
- **isSignificantFile suite**: File significance determination
- **getRelevantContext suite**: Wiki context retrieval
- **determinePagePath suite**: Path mapping and naming conventions
- **processRepository suite**: Repository-level operations

Test mocks verify interactions with WikiManager, CodeAnalysisAgent, DocumentationWriterAgent, and StateManager, ensuring proper delegation and coordination patterns.