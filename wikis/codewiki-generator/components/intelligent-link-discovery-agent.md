---
title: Intelligent link discovery agent
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Intelligent Link Discovery Agent

## Purpose and Overview

The intelligent link discovery agent is a post-processing component that analyzes generated wiki pages to identify semantic relationships and establish cross-page connections. It operates as part of a multi-phase documentation generation pipeline, creating an interconnected wiki structure after all initial content has been generated.

## Key Functionality

The agent implements a two-phase approach to documentation generation:

1. **Content Generation Phase**: Creates individual wiki pages (architecture overviews, guides, indexes) using existing documentation agents
2. **Link Discovery Phase**: Analyzes completed pages to identify related content and inject hyperlinks

Key capabilities include:
- **Semantic Analysis**: Examines page content to identify conceptual relationships between different documentation sections
- **Cross-Link Injection**: Automatically inserts hyperlinks between related pages within the content body
- **Metadata Enhancement**: Updates page frontmatter with relationship information and cross-references
- **Wiki Navigation**: Improves overall wiki navigability by creating a web of interconnected pages

The agent integrates with the existing `LinkDiscoveryAgent` module and uses the `addCrossLinks` method to establish both inline hyperlinks and frontmatter-based page relationships.

## Relationships

The intelligent link discovery agent connects to several core components:

- **WikiManager**: Interfaces with wiki pages through `getPage`, `updatePage`, `searchPages`, and `getRelatedPages` methods
- **StateManager**: Accesses repository state information via `loadState` functionality  
- **Documentation Agents**: Works alongside existing agents (CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, SecurityAgent) in the processing pipeline
- **Cross-page Linking System**: Forms part of the broader linking infrastructure that processes pages after generation

This separation of concerns allows content generation to complete before cross-referencing begins, enabling more intelligent relationship discovery across the full documentation set.

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with required managers and agents
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent
});

// Process repository to generate documentation with intelligent linking
await processor.processRepository();
```

## Testing

**Test Coverage**: `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Test categories: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, processRepository
- Comprehensive mocking of WikiManager, StateManager, and documentation agents