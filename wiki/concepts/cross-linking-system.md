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

The cross-linking system automatically discovers and creates links between wiki pages by finding mentions of page titles within content. This system enhances wiki navigation by connecting related pages without manual intervention, making the documentation more interconnected and discoverable.

## Key Functionality

The cross-linking system operates through several key components:

- **Link Discovery**: Scans page content to identify mentions of other page titles within the text
- **Automated Linking**: Creates hyperlinks from discovered mentions to their corresponding wiki pages
- **Page Analysis**: Examines wiki structure to understand relationships between different documentation pages
- **Debug Capabilities**: Provides tools to troubleshoot and analyze the link discovery process

The system works by loading all available wiki pages, then analyzing content to find text that matches existing page titles. When matches are found, it automatically generates appropriate markdown links to connect the pages.

## Relationships

The cross-linking system integrates with several core components:

- **WikiManager**: Loads and manages wiki pages for analysis and link discovery
- **[LinkDiscoveryAgent](../components/link-discovery-agent.md)**: Handles the core logic for finding page title mentions within content
- **DocumentationWriterAgent**: Generates documentation that incorporates discovered cross-links
- **Architecture Documentation**: Uses `architecture.md` as a primary test case for link discovery functionality

## Usage Example

```javascript
// Debug and test cross-linking functionality
const { WikiManager } = require('./wiki-manager');
const { [LinkDiscoveryAgent](../components/link-discovery-agent.md) } = require('./link-discovery-agent');

async function debugCrossLinks() {
  // Load all wiki pages
  const wikiManager = new WikiManager();
  const pages = await wikiManager.loadAllPages();
  
  // Test link discovery on architecture page
  const linkAgent = new [LinkDiscoveryAgent](../components/link-discovery-agent.md)(pages);
  const architecturePage = pages.find(p => p.filename === 'architecture.md');
  const discoveredLinks = await linkAgent.findMentions(architecturePage.content);
  
  console.log(`Found ${discoveredLinks.length} cross-link opportunities`);
}
```

## Testing

No automated tests are currently available for the cross-linking system. The primary testing method uses the `debug-cross-links.js` script to manually verify link discovery functionality against real wiki content, particularly using `architecture.md` as a representative test case.