---
title: Related pages discovery system
category: concept
sourceFile: Not specified
related: [components/link-discovery-agent.md, components/wiki-manager-integration.md]
created: 2025-11-23
updated: 2025-11-23
---

# Related Pages Discovery System

## Purpose and Overview

The Related Pages Discovery System automatically identifies and links related wiki pages based on content analysis and cross-references. It scans wiki content to find mentions of other pages and establishes relationships between related documentation, improving wiki navigation and discoverability.

## Key Functionality

The system operates through several key components:

- **Content Analysis**: Scans wiki pages to identify mentions of other pages, components, and concepts
- **Relationship Discovery**: Uses the [LinkDiscoveryAgent](../components/link-discovery-agent.md) to analyze content and establish connections between pages
- **Cross-linking**: Automatically generates links between related pages based on discovered relationships
- **Wiki Integration**: Leverages WikiManager for page loading and content management operations

The discovery process analyzes page content to find explicit mentions, shared concepts, and related topics, then creates a network of interconnected wiki pages.

## Relationships

- **[WikiManager Integration](../components/wiki-manager-integration.md)**: Uses WikiManager to load and manage wiki page content, providing the foundation for content analysis
- **[LinkDiscoveryAgent](../components/link-discovery-agent.md)**: Integrates with the [LinkDiscoveryAgent](../components/link-discovery-agent.md) component for intelligent content analysis and relationship discovery
- **Agent Architecture**: Functions as part of the broader agent-based system for automated wiki content processing and enhancement

## Usage Example

```javascript
const WikiManager = require('./wiki/WikiManager');
const LinkDiscoveryAgent = require('./agents/[LinkDiscoveryAgent](../components/link-discovery-agent.md)');

// Initialize the discovery system
const wikiManager = new WikiManager();
const linkAgent = new [LinkDiscoveryAgent](../components/link-discovery-agent.md)();

// Load wiki pages and discover relationships
async function discoverRelatedPages() {
  const pages = await wikiManager.loadAllPages();
  const targetPage = 'architecture.md';
  
  const relatedPages = await linkAgent.findRelatedPages(targetPage, pages);
  console.log(`Found ${relatedPages.length} related pages for ${targetPage}`);
  
  return relatedPages;
}
```

## Testing

No automated tests are currently available for this system. Testing is performed through manual debugging functions that load wiki content and verify relationship discovery on sample pages like `architecture.md`.