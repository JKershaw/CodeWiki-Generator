---
title: Multi-phase documentation generation pipeline
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-phase Documentation Generation Pipeline

## Purpose and Overview

The multi-phase documentation generation pipeline implements an architectural pattern that separates documentation creation into sequential phases: initial content generation followed by relationship discovery and cross-linking. This approach allows all wiki pages to be generated first, then analyzed collectively to establish semantic connections and inject intelligent hyperlinks throughout the documentation structure.

## Key Functionality

The pipeline operates in two distinct phases:

1. **Content Generation Phase**: Creates core documentation pages including architecture overviews, guides, and indexes using specialized agents (CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, SecurityAgent)

2. **Cross-linking Phase**: Employs the LinkDiscoveryAgent to analyze all generated content, identify related pages, and inject both inline hyperlinks and frontmatter-based relationships across the wiki structure

The processor coordinates multiple agents and manages wiki page creation, updates, and metadata enrichment. It determines page paths, processes repository commits, filters significant files, and gathers relevant context for documentation generation.

## Relationships

- **Integrates with WikiManager**: Creates, updates, and searches wiki pages while managing global metadata
- **Coordinates Documentation Agents**: Orchestrates CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, and SecurityAgent for content generation
- **Utilizes LinkDiscoveryAgent**: Leverages intelligent link discovery to establish cross-page relationships
- **Works with StateManager**: Loads and maintains processing state across documentation runs
- **Connects to Repository Analysis**: Processes commits and analyzes file significance for targeted documentation updates

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize with required dependencies
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// Process repository for documentation generation
await processor.processRepository();

// Process specific commit changes
await processor.processCommit(commitHash);
```

## Testing

Comprehensive test coverage is provided in `tests/unit/processor.test.js` with 26 test cases across 6 test suites. Testing covers core processor functionality including commit processing, file significance determination, context gathering, page path resolution, and full repository processing workflows.