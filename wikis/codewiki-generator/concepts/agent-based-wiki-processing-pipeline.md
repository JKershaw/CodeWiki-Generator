---
title: Agent-based wiki processing pipeline
category: concept
sourceFile: debug-cross-links.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Agent-based Wiki Processing Pipeline

## Purpose and [Overview](../meta/overview.md)

The agent-based wiki processing pipeline demonstrates a modular architecture where specialized agents collaborate to process wiki content through cross-link discovery and validation. This debugging utility serves as both a testing tool and reference implementation for verifying the end-to-end linking pipeline works correctly.

## Key Functionality

The pipeline orchestrates multiple specialized agents working together:

- **LinkDiscoveryAgent**: Analyzes full page content to identify mentions and potential cross-links between wiki pages
- **DocumentationWriterAgent**: Handles content processing and documentation generation tasks  
- **WikiManager**: Coordinates agent interactions and manages the overall wiki processing workflow

The system loads complete page content (not just metadata) to ensure accurate mention discovery, addressing critical issues where partial content loading resulted in missed cross-links. The workflow follows a pattern of content loading → mention discovery → link validation → cross-reference generation.

## Relationships

This component integrates with several core wiki system components:

- **WikiManager**: Acts as the central coordinator that manages agent lifecycles and orchestrates the processing pipeline
- **LinkDiscoveryAgent**: Consumes full page content to perform cross-link analysis and mention detection
- **DocumentationWriterAgent**: Processes discovered links and generates appropriate documentation updates
- **Wiki Content System**: Requires full page content loading capability to provide complete context for link analysis

The pipeline represents a debugging and validation layer that sits on top of the core wiki processing infrastructure.

## Usage Example

```javascript
// Initialize the wiki manager and agents
const wikiManager = new WikiManager();
const linkAgent = new LinkDiscoveryAgent();
const writerAgent = new DocumentationWriterAgent();

// Load full page content and process cross-links
const pageContent = await wikiManager.loadFullPageContent(pageName);
const discoveredLinks = await linkAgent.discoverMentions(pageContent);
await writerAgent.validateLinkingPipeline(discoveredLinks);
```

## Testing

No automated tests found. This component serves as a debugging utility for manual verification of the cross-linking implementation.