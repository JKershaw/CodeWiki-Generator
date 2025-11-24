---
title: Agent-based content processing pipeline
category: concept
sourceFile: debug-cross-links.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Agent-Based Content Processing Pipeline

## Purpose and Overview

The agent-based content processing pipeline demonstrates how specialized agents work in sequence with `WikiManager` to process and enhance wiki content. This debug script (`debug-cross-links.js`) validates the cross-linking implementation by loading full page content and testing the link discovery pipeline on actual wiki pages, establishing a reusable pattern for content transformation workflows.

## Key Functionality

The pipeline orchestrates the following workflow:

1. **Content Loading** - Retrieves all wiki pages from `WikiManager` to establish a complete content inventory
2. **Page Structure Examination** - Inspects the loaded pages to verify data integrity and availability
3. **Link Discovery** - Uses `LinkDiscoveryAgent` to identify cross-reference mentions within page content
4. **Result Reporting** - Outputs findings, identified links, and any errors encountered during processing

The pipeline demonstrates how agents follow a common interface pattern: accepting page data as input and returning structured output containing discovered cross-links and their target paths.

## Relationships

- **WikiManager** - Provides the data source, retrieving full page content required for accurate link discovery through its `getAllPages()` method
- **LinkDiscoveryAgent** - Consumes page content and the full page list to identify cross-references via its `findMentions()` method
- **DocumentationWriterAgent** - Available within the pipeline architecture for extending the content processing chain with additional transformation stages

The debug script validates the integration between these components, ensuring that content loading and link discovery operate correctly together.

## Usage Example

```javascript
const WikiManager = require('./wiki-manager');
const LinkDiscoveryAgent = require('./agents/link-discovery-agent');

async function main() {
  const wikiManager = new WikiManager();
  const allPages = wikiManager.getAllPages();
  
  const linkAgent = new LinkDiscoveryAgent();
  const mentions = linkAgent.findMentions(pageContent, allPages);
  
  console.log('Discovered links:', mentions);
}

main();
```

This example shows the basic pattern: initialize `WikiManager` to load content, create a `LinkDiscoveryAgent`, and call `findMentions()` with page content and the full page list to retrieve identified cross-references.

## Design Pattern

The pipeline establishes a composable architecture where:

- Each agent handles a specific content transformation task
- Agents accept standardized page data inputs
- Agents return structured results suitable for downstream processing
- New processing stages can be added to the pipeline without modifying existing agents

This pattern supports extensibility for adding new agents (e.g., validation agents, enrichment agents) while maintaining clear separation of concerns.

## Testing

No automated tests are currently available. To validate the pipeline implementation, run the debug script directly on your wiki content to inspect:

- Page loading and structure integrity
- Link discovery accuracy on actual wiki pages
- Error reporting for troubleshooting cross-link failures