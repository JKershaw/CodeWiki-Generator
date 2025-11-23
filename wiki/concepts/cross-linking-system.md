---
title: Cross-linking system
category: concept
sourceFile: Not specified
related: [components/link-discovery-agent.md]
created: 2025-11-23
updated: 2025-11-23
---

# Cross-linking System

## Purpose and Overview

The cross-linking system automatically discovers and creates links between related wiki pages through intelligent content analysis and mention detection. This system enhances wiki navigation by identifying when one page mentions another and converting those mentions into proper internal links, creating an interconnected knowledge graph.

## Key Functionality

The cross-linking system operates through content analysis and automated link generation:

- **Mention Detection**: Scans page content to identify references to other wiki pages by analyzing text for page titles and related terms
- **Related Page Discovery**: Uses the [LinkDiscoveryAgent](../components/link-discovery-agent.md) to find conceptually related pages through content analysis and cross-referencing
- **Automatic Link Generation**: Converts discovered mentions into proper markdown links that connect related documentation
- **Wiki Integration**: Works seamlessly with the WikiManager to load existing pages and update them with new cross-links
- **Debug Support**: Includes standalone debug scripts that test the cross-linking functionality in isolation for development and troubleshooting

The system processes individual pages or entire wiki sections, analyzing content to build connections between related concepts and documentation areas.

## Relationships

The cross-linking system integrates with several core wiki components:

- **[WikiManager](../components/wiki-manager.md)**: Handles page loading, retrieval, and management operations for cross-link processing
- **[LinkDiscoveryAgent](../agents/link-discovery-agent.md)**: Performs the core content analysis to discover mentions and related page connections
- **[Debug Scripts Pattern](../guides/debug-scripts-pattern.md)**: Implements standalone testing scripts for isolated functionality verification
- **Wiki Content Pipeline**: Functions as part of the broader content processing and maintenance workflow

## Usage Example

```javascript
const { WikiManager } = require('./lib/wiki-manager');
const { LinkDiscoveryAgent } = require('./lib/agents/link-discovery-agent');

async function discoverRelatedPages() {
  const wikiManager = new WikiManager();
  const linkAgent = new [LinkDiscoveryAgent](../components/link-discovery-agent.md)();
  
  // Load target page for analysis
  const page = await wikiManager.loadPage('architecture.md');
  
  // Discover related pages and mentions
  const relatedPages = await linkAgent.findRelatedPages(page);
  
  console.log('Related pages found:', relatedPages);
}

discoverRelatedPages();
```

## Testing

No automated tests are currently available for the cross-linking system. Testing is performed through standalone debug scripts that test specific subsystems in isolation, allowing developers to verify cross-linking functionality and troubleshoot issues during development.