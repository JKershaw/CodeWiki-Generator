---
title: WikiManager integration
category: component
sourceFile: Not specified
related: [components/link-discovery-agent.md, concepts/related-pages-discovery-system.md]
created: 2025-11-23
updated: 2025-11-23
---

# WikiManager Integration

## Purpose and Overview

WikiManager integration provides wiki content management and page loading functionality for the [related pages discovery system](../concepts/related-pages-discovery-system.md). It serves as the core component that enables loading, managing, and processing wiki pages within the agent-based architecture for content analysis and cross-linking.

## Key Functionality

The WikiManager integration handles several key responsibilities:

- **Page Loading**: Loads and manages wiki page content from the filesystem or storage
- **Content Management**: Provides access to wiki pages for analysis and processing
- **Related Page Discovery**: Works with [LinkDiscoveryAgent](../components/link-discovery-agent.md) to find connections between pages
- **Cross-linking Support**: Enables automatic discovery of page relationships based on content analysis and mentions

The system analyzes page content to identify mentions of other pages and builds relationships between related wiki content automatically.

## Relationships

- **Uses WikiManager**: Leverages WikiManager to load and manage wiki page content from storage
- **Integrates with [LinkDiscoveryAgent](../components/link-discovery-agent.md)**: Works with the agent responsible for analyzing page content to find mentions and discover related pages  
- **Part of Agent Architecture**: Functions as a component within the broader agent-based architecture for wiki content processing
- **Supports Cross-linking System**: Provides the foundation for the [related pages discovery system](../concepts/related-pages-discovery-system.md) that implements cross-linking functionality

## Usage Example

```javascript
const WikiManager = require('./wiki-manager');
const LinkDiscoveryAgent = require('./link-discovery-agent');

// Initialize WikiManager and load pages
const wikiManager = new WikiManager();
await wikiManager.loadAllPages();

// Create link discovery agent
const linkAgent = new [LinkDiscoveryAgent](../components/link-discovery-agent.md)(wikiManager);

// Discover related pages for a specific page
const relatedPages = await linkAgent.findRelatedPages('architecture.md');
console.log('Related pages:', relatedPages);
```

## Testing

No automated tests are currently available for this component. Consider implementing tests to verify page loading functionality, related page discovery accuracy, and integration between WikiManager and [LinkDiscoveryAgent](../components/link-discovery-agent.md) components.