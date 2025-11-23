---
title: Sequential cross-linking pipeline
category: concept
sourceFile: Not specified
related: [components/link-discovery-agent.md]
created: 2025-11-23
updated: 2025-11-23
---

# Sequential Cross-linking Pipeline

## Purpose and Overview

The sequential cross-linking pipeline establishes an ordered processing pattern for wiki page cross-linking operations. It ensures that related page discovery occurs before link insertion to maintain content integrity and prevent broken or circular references.

## Key Functionality

The pipeline coordinates a two-phase approach to cross-linking:

1. **Discovery Phase**: Uses the [LinkDiscoveryAgent](../components/link-discovery-agent.md) to identify related pages and potential cross-links across the wiki
2. **Implementation Phase**: Uses the DocumentationWriterAgent to insert discovered links into page content

The pipeline implements a two-phase loading strategy:
- **Metadata Loading**: Retrieves page metadata for quick relationship analysis
- **Full Content Loading**: Loads complete page content only when needed for link insertion

This approach minimizes memory usage while ensuring all cross-linking decisions are made with complete context about page relationships.

## Relationships

- **Depends on WikiManager**: Handles page data loading and persistence operations
- **Coordinates LinkDiscoveryAgent**: Manages the identification of related pages and cross-linking opportunities
- **Coordinates DocumentationWriterAgent**: Handles the actual insertion of cross-links into page content
- **Utilizes updatePage function**: Replaces the previous writePage method for updating existing wiki pages with new content and metadata

## Usage Example

```javascript
const { WikiManager } = require('./wiki-manager');
const { LinkDiscoveryAgent } = require('./link-discovery-agent');
const { DocumentationWriterAgent } = require('./documentation-writer-agent');

// Initialize pipeline components
const wikiManager = new WikiManager('./wiki-data');
const linkDiscovery = new [LinkDiscoveryAgent](../components/link-discovery-agent.md)();
const docWriter = new DocumentationWriterAgent();

// Execute sequential cross-linking pipeline
async function runCrossLinkingPipeline() {
  // Phase 1: Discover related pages
  const pageMetadata = await wikiManager.loadPageMetadata();
  const crossLinks = await linkDiscovery.findRelatedPages(pageMetadata);
  
  // Phase 2: Apply cross-links to content
  const fullContent = await wikiManager.loadFullContent(crossLinks.targetPages);
  const updatedPages = await docWriter.insertCrossLinks(fullContent, crossLinks);
  
  // Persist changes
  await Promise.all(updatedPages.map(page => wikiManager.updatePage(page)));
}
```

## Testing

No automated tests found for this component.