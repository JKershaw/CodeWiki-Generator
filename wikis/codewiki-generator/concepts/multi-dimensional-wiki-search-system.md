---
title: Multi-dimensional wiki search system
category: concept
sourceFile: lib/wiki-search-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiSearchService

## Purpose and Overview

The WikiSearchService provides advanced search and navigation capabilities for wiki content, implementing a multi-dimensional search system that combines full-text search with metadata-based filtering and relevance scoring. It enables users to find relevant content through intelligent search ranking and discover related pages through automated relationship analysis.

## Key Functionality

**Search Operations**
- **Full-text search** with weighted relevance scoring based on title, content, tags, and category matches
- **Contextual snippet extraction** that highlights search terms and provides preview content
- **Multi-factor ranking** that prioritizes matches in titles and categories over general content matches

**Content Navigation**
- **Table of contents extraction** from HTML content by parsing heading tag hierarchies
- **Related page discovery** using explicit links, shared categories, common tags, and content references
- **Relationship scoring** that quantifies connections between wiki pages for better content discovery

**Search Intelligence**
- Relevance scoring weighs title matches highest, followed by categories, tags, and content
- Snippet generation finds the best contextual preview around search terms
- Related page algorithms combine multiple signals to surface truly relevant connections

## Relationships

- **Depends on WikiManager** for accessing and managing wiki page data and metadata
- **Extends dashboard capabilities** by providing the search and navigation layer for wiki interfaces  
- **Integrates with wiki metadata structure** leveraging existing tags, categories, and title organization for enhanced search relevance

## Usage Example

```javascript
const WikiSearchService = require('./lib/wiki-search-service');
const searchService = new WikiSearchService(wikiManager);

// Search wiki pages
const searchResults = await searchService.searchWiki('javascript functions', projectId);

// Get table of contents for a page
const toc = searchService.getTableOfContents(pageContent);

// Find related pages
const relatedPages = await searchService.getRelatedPages(pageId, projectId);
```

## Testing

No automated tests found for this component.