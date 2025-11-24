---
title: Cross-link validation and debugging
category: guide
sourceFile: debug-cross-links.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Cross-link Validation and Debugging

## Purpose and Overview

The `debug-cross-links.js` script provides a diagnostic tool for validating the cross-linking implementation within the wiki system. It loads full page content from the wiki, inspects page structure, and tests the link discovery pipeline on actual pages to identify and report any cross-link failures or anomalies.

## Key Functionality

The debug script orchestrates a validation workflow through the following steps:

- **Page Loading**: Uses `WikiManager` to retrieve all wiki pages and their full content
- **Structure Inspection**: Examines the loaded page data to verify proper content formatting
- **Link Discovery Testing**: Applies `LinkDiscoveryAgent` to detect cross-reference mentions within page content
- **Error Reporting**: Reports findings and any errors encountered during the validation process

The `main()` function serves as the entry point, executing the complete diagnostic pipeline and surfacing issues that may prevent cross-links from being properly discovered and established.

## Relationships

This script connects several core components in the content processing pipeline:

- **WikiManager**: Provides the `getAllPages()` method to fetch full page content required for accurate link discovery
- **LinkDiscoveryAgent**: Uses page content and the complete page list to identify cross-reference mentions via the `findMentions()` method, which returns an array of discovered links and their target paths
- **DocumentationWriterAgent**: Included in the pipeline (instantiated but not actively used in current validation)

The script validates the integration between content loading and link discovery, ensuring that both components work correctly together. All agents follow a common interface pattern with page data as input and structured output for results.

## Usage Example

```javascript
const WikiManager = require('./wiki-manager');
const LinkDiscoveryAgent = require('./link-discovery-agent');

async function validateCrossLinks() {
  const wikiManager = new WikiManager();
  const linkAgent = new LinkDiscoveryAgent();
  
  const pages = await wikiManager.getAllPages();
  const mentions = await linkAgent.findMentions(pages[0], pages);
  
  console.log('Discovered links:', mentions);
}

validateCrossLinks();
```

## Testing

No automated test coverage is currently available for this debug script. When using this tool to validate cross-link functionality, manually inspect the reported findings and verify that:

- All wiki pages load with complete content
- The page structure matches expected formats
- Link mentions are accurately discovered on test pages
- Target paths resolve correctly to existing wiki pages