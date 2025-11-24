---
title: Wiki API Parameter Ordering and Structure
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Processor

## Purpose and Overview

The Processor component manages the core workflow for analyzing code repositories and generating wiki documentation. It orchestrates interactions between multiple agents and managers to process commits, identify significant files, extract relevant context, and create or update wiki pages with generated documentation.

## Key Functionality

### Core Processing Methods

**processCommit()**
Analyzes a single commit to determine if it warrants documentation updates. Evaluates commit significance and triggers relevant documentation generation workflows.

**processRepository()**
Executes a complete analysis pass over a repository, identifying all files that require documentation attention and coordinating the generation of wiki content.

**isSignificantFile()**
Determines whether a file change is substantial enough to trigger documentation updates, filtering out trivial or non-documentation-relevant modifications.

**getRelevantContext()**
Gathers necessary context from the codebase and existing documentation to inform the documentation generation process. Works with the WikiManager to retrieve related pages and current state.

**determinePagePath(name)**
Converts a concept name to a kebab-case file path with `.md` extension for consistent wiki page organization. For example: `"Wiki API Parameter"` → `wiki-api-parameter.md`

### Page Management

**updatePage(content, options)**
Updates an existing wiki page with new content and metadata. The `options` object contains configuration such as page title and other metadata.

**createPage(content, options)**
Creates a new wiki page with provided content and configuration. Follows the same parameter structure as `updatePage` for consistency.

### State Machine

The Processor employs a state machine to track its lifecycle:
- **'processing'** → Initial state when work begins
- **'running'** → Active execution state
- **'stopped'** → Terminal state after completion
- **'completed'** → Final state indicating successful completion

This semantic distinction prevents confusion between actively running processes and terminal states.

## Relationships

- **WikiManager**: Provides page creation, retrieval, and update operations. The Processor delegates all wiki storage operations through this interface.
- **StateManager**: Persists processor state across invocations, enabling resumable workflows and state tracking through the processing lifecycle.
- **Code Analysis Agent**: Performs structural and semantic analysis of code changes to extract documentation-relevant concepts.
- **Doc Writer Agent**: Generates formatted documentation content based on analysis results.

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent
});

// Process a repository
await processor.processRepository();

// Create a new wiki page
await processor.createPage('Documentation content here', {
  title: 'My Feature'
});

// Determine path for a concept
const pagePath = processor.determinePagePath('Wiki API Parameter Ordering');
// Returns: 'wiki-api-parameter-ordering.md'
```

## Testing

The Processor component has comprehensive test coverage with **26 test cases** across **6 test suites** in `tests/unit/processor.test.js`:

- **Processor initialization and lifecycle**
- **processCommit()** behavior and significance detection
- **isSignificantFile()** filtering logic
- **getRelevantContext()** data aggregation
- **determinePagePath()** name-to-path conversion
- **processRepository()** orchestration workflows

Test suites validate state transitions, manager integrations, and proper parameter handling for wiki page operations.