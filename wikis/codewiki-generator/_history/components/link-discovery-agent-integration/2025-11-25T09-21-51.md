---
title: LinkDiscoveryAgent integration
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# LinkDiscoveryAgent Integration

## Purpose and Overview

The LinkDiscoveryAgent integration extends the processor's multi-stage document generation pipeline with intelligent cross-page linking capabilities. This component enables the system to discover and create relationships between wiki pages after the initial documentation generation phase, improving navigation and discoverability across the codebase documentation.

## Key Functionality

The integration implements a **cross-page linking system** that operates in two distinct phases:

1. **Core Generation Phase**: Standard document processing using existing agents (CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, SecurityAgent)
2. **Post-Generation Linking Phase**: LinkDiscoveryAgent analyzes generated content to identify related pages and creates inline hyperlinks and frontmatter metadata

The **multi-stage document generation pipeline** ensures that link discovery occurs after all pages exist, allowing the agent to:
- Analyze relationships between completed documentation pages
- Generate contextual cross-references based on content similarity
- Update existing pages with discovered links without disrupting the primary generation process
- Maintain separation of concerns between content creation and relationship discovery

## Relationships

The LinkDiscoveryAgent integrates with several core components:

- **WikiManager**: Uses `searchPages`, `getRelatedPages`, and `updatePageGlobalMetadata` methods to query existing pages and update them with discovered links
- **StateManager**: Leverages state management for tracking processed relationships and avoiding duplicate link creation
- **Processor**: Extends the main processing pipeline as an additional agent type alongside existing analysis agents
- **Existing Agents**: Operates independently from CodeAnalysisAgent, DocWriterAgent, TechDebtAgent, and SecurityAgent while building upon their generated content

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with LinkDiscoveryAgent included in agent configuration
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  agents: {
    codeAnalysis: mockCodeAnalysisAgent,
    docWriter: mockDocWriterAgent,
    techDebt: mockTechDebtAgent,
    security: mockSecurityAgent,
    linkDiscovery: mockLinkDiscoveryAgent
  }
});

// Process repository - LinkDiscoveryAgent runs in post-generation phase
await processor.processRepository(repositoryPath);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Test categories include: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository
- Comprehensive mocking of WikiManager methods (`getPage`, `createPage`, `updatePage`, `searchPages`, `getRelatedPages`, `updatePageGlobalMetadata`) validates integration points