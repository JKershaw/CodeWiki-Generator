---
title: Full-page content loading for cross-linking analysis
category: guide
sourceFile: debug-related.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Full-page Content Loading for Cross-linking Analysis

## Purpose and [Overview](../meta/overview.md)

This component establishes the pattern for loading complete page content to enable accurate cross-linking discovery and relationship detection across the wiki. It ensures that mention-finding and related-page analysis have access to full content rather than just metadata, which is essential for comprehensive link discovery.

## Key Functionality

- **Complete Content Loading**: Loads entire page content instead of partial or metadata-only representations to support thorough cross-linking analysis
- **Cross-linking Discovery**: Enables accurate detection of mentions and relationships between wiki pages by providing full textual context
- **Content Analysis Foundation**: Provides the necessary data foundation for link discovery algorithms to identify connections that might be missed with partial content

The system prioritizes content completeness over loading speed to ensure that cross-linking analysis can identify all potential relationships and mentions within the wiki structure.

## Relationships

- **LinkDiscoveryAgent**: Works closely with the Link Discovery Agent, providing the full content necessary for mention-finding and related-page-finding capabilities
- **Wiki Content System**: Integrates with the broader wiki infrastructure to retrieve complete page data for analysis
- **Testing and Validation**: Supports validation workflows that measure discovery accuracy against real page content

## Usage Example

```javascript
// Load full page content for cross-linking analysis
const pageContent = await loadFullPageContent(pageId);

// Enable comprehensive mention detection with complete content
const linkDiscoveryAgent = new LinkDiscoveryAgent();
const mentions = linkDiscoveryAgent.findMentions(pageContent);
const relatedPages = linkDiscoveryAgent.findRelatedPages(pageContent);
```

## Testing

No automated tests found. The component supports Link Discovery Agent testing and validation by providing real page content for measuring discovery accuracy, but specific test coverage is not currently implemented.