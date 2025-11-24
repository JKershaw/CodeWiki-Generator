---
title: Repository introspection for documentation context
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Repository Introspection for Documentation Context

## Purpose and Overview

Repository introspection enables the documentation system to analyze repository structure and detect technology stack information, which is then used to contextualize and enrich guide generation. This component scans the repository's file structure and configuration to extract metadata that informs how operational guides are generated and tailored to the project's specific context.

## Key Functionality

The repository introspection system operates through several interconnected functions:

- **detectRepositoryInfo()**: Analyzes the repository file structure to extract technology and configuration information. This function traverses the codebase and identifies file types, package managers, frameworks, and other relevant technology stack indicators that provide context for guide generation.

- **scanDir()**: Recursively traverses the repository directory structure while intelligently excluding hidden directories (prefixed with `.`) and `node_modules`. This provides a clean view of the actual project structure without unnecessary noise from dependencies and system files.

- **generateWikiGuides()**: Orchestrates the complete guide generation workflow by:
  1. Collecting all wiki pages via `WikiManager.getAllPages()`
  2. Categorizing pages by metadata (components, concepts)
  3. Detecting repository information through introspection
  4. Invoking the `GuideGenerationAgent` with collected context
  5. Persisting generated guides back to the wiki

The introspection data complements existing code analysis functionality, providing richer contextual information for guide generation without duplicating analysis work.

## Relationships

Repository introspection integrates into the broader documentation pipeline:

- **Precedes guide generation**: `generateWikiGuides()` executes before `generateWikiIndex()`, establishing introspection as a foundational step
- **Feeds GuideGenerationAgent**: Detected repository information is passed to the specialized `GuideGenerationAgent` alongside categorized wiki content
- **Complements code analysis**: Works alongside existing `CodeAnalysisAgent` functionality to provide repository-level context
- **Graceful degradation**: Follows established error handling patterns—guide generation failures are logged as warnings and do not halt the overall processing pipeline

## Usage Example

```javascript
const Processor = require('./lib/processor');
const WikiManager = require('./lib/wiki-manager');
const StateManager = require('./lib/state-manager');

const processor = new Processor(wikiManager, stateManager);

// Repository introspection runs automatically as part of guide generation
await processor.generateWikiGuides();

// Generated guides are persisted to the wiki and available for retrieval
const guides = wikiManager.getAllPages({ category: 'guide' });
```

The introspection occurs transparently during `generateWikiGuides()` execution—no separate initialization is required. Repository information is detected, guides are generated with that context, and results are stored in the wiki system.

## Testing

The documentation pipeline is covered by comprehensive test coverage in `tests/unit/processor.test.js`:

- **26 test cases** across **6 test suites**
- Test categories include: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository
- Repository analysis functionality is validated through both unit tests and integration with the broader processing pipeline
- Mock implementations verify correct interaction with WikiManager and StateManager dependencies