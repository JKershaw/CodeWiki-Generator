---
title: Agent-based code analysis and documentation generation
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Processor

## Purpose and Overview

The Processor orchestrates the complete workflow of analyzing code commits and automatically generating or updating wiki documentation. It serves as the central coordinator that bridges version control changes with knowledge management, using specialized agents to analyze code modifications and create meaningful documentation that captures architectural concepts.

## Key Functionality

The Processor implements a commit-driven documentation pipeline with the following core responsibilities:

**Commit Processing**: Analyzes all files changed in a commit, filters out trivial changes, and extracts architecturally significant concepts that warrant documentation.

**Significance Filtering**: Delegates to CodeAnalysisAgent to determine whether a file contains meaningful changes worth documenting, avoiding noise from minor modifications.

**Concept Extraction**: Identifies high-level architectural concepts from code patches rather than low-level implementation details, ensuring documentation focuses on design patterns and system architecture.

**Contextual Documentation**: Retrieves existing related wiki pages before generating new documentation, enabling the DocumentationWriterAgent to build upon and integrate with prior knowledge.

**Wiki Integration**: Manages the full lifecycle of documentation pages—creating new pages for new concepts, updating existing pages with fresh insights, and maintaining consistent organization through standardized naming conventions.

**Path Standardization**: Converts concept names to kebab-case wiki paths under a `components/` hierarchy, enabling predictable and consistent documentation discovery.

## Relationships

- **WikiManager**: Coordinates page CRUD operations (create, read, update) and retrieves related pages for context
- **CodeAnalysisAgent**: Delegates code analysis, significance filtering, and concept extraction logic
- **DocumentationWriterAgent**: Handles the actual generation and refinement of documentation content
- **StateManager**: Tracks state across processing runs (initialized but not actively used in current implementation)

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize with dependencies
const processor = new Processor(wikiManager, codeAnalysisAgent, docWriterAgent, stateManager);

// Process a single commit
const summary = processor.processCommit({
  files: [
    {
      path: 'lib/analysis.js',
      patch: '+ function analyzeCodePatterns() { ... }'
    }
  ]
});

// Returns summary of documentation actions
console.log(summary);
// { created: 1, updated: 0, concepts: ['Code Analysis Engine'] }
```

## Testing

The Processor has comprehensive test coverage with **26 test cases** across **6 test suites** in `tests/unit/processor.test.js`. Test categories include:

- Processor initialization and configuration
- Commit processing workflows
- File significance filtering logic
- Context retrieval from wiki
- Wiki path generation and naming conventions
- Repository-wide processing

Tests verify correct delegation to agents, proper wiki integration, accurate concept extraction, and accurate documentation action tracking.