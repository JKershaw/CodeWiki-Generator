---
title: Cross-page linking system
category: component
sourceFile: lib/processor.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Cross-page linking system

## Purpose and Overview

The cross-page linking system is a post-generation component that automatically injects hyperlinks between wiki pages and enriches page metadata with related page information. It implements a multi-phase documentation generation pipeline where content enhancement occurs after initial page creation, enabling intelligent cross-referencing across the entire wiki structure.

## Key Functionality

The system operates through a coordinated workflow that processes generated documentation in distinct phases:

- **Multi-phase Processing**: Implements sequential processing where initial content generation (architecture overview, guides, index) completes before relationship discovery and linking begins
- **Intelligent Link Discovery**: Uses LinkDiscoveryAgent to analyze page content and identify semantic connections between related pages throughout the wiki
- **Cross-link Injection**: Automatically injects hyperlinks into page content using the addCrossLinks method, creating navigable connections between related documentation
- **Metadata Enrichment**: Updates page frontmatter with related pages information and global metadata tracking for enhanced discoverability
- **Efficient Updates**: Only writes page changes when content modifications occur, optimizing performance during incremental processing

This separation of concerns allows the system to make intelligent decisions about page relationships after all content exists, resulting in more accurate and comprehensive linking.

## Relationships

The cross-page linking system integrates with several core components in the documentation pipeline:

- **Processor**: Acts as the orchestration layer that coordinates the multi-phase generation pipeline
- **LinkDiscoveryAgent**: Performs the semantic analysis to identify related pages and establish cross-references
- **WikiManager**: Provides page retrieval, search capabilities, and handles updates with new links and metadata
- **DocumentationWriterAgent**: Works in conjunction with link discovery to inject hyperlinks into page content
- **StateManager**: Enables efficient incremental processing by tracking what has been linked previously

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with required dependencies
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  linkDiscoveryAgent: mockLinkDiscoveryAgent
});

// Process repository to generate and cross-link documentation
await processor.processRepository(repositoryPath);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Test categories include: Processor, processCommit, isSignificantFile, getRelevantContext, determinePagePath, processRepository
- Comprehensive mocking of WikiManager, StateManager, and all agent dependencies for isolated unit testing