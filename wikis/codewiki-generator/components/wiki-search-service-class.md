---
title: WikiSearchService class
category: component
sourceFile: lib/wiki-search-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiSearchService

## Purpose and Overview

The WikiSearchService class provides advanced search and navigation capabilities for wiki content, implementing a multi-dimensional search system that combines full-text search, metadata filtering, and intelligent content discovery. It automatically scores search relevance and discovers relationships between pages to enhance wiki navigation and content exploration.

## Key Functionality

### Search Capabilities
- **Full-text search** with weighted relevance scoring across titles, content, tags, and categories
- **Contextual snippet extraction** that highlights search terms in result previews
- **Multi-factor relevance scoring** that prioritizes title matches over content matches

### Content Navigation
- **Table of contents extraction** from HTML content by parsing heading hierarchies
- **Related page discovery** using explicit links, shared categories, common tags, and content references
- **Relationship scoring** that ranks related content by connection strength

### Search Algorithm
The service calculates relevance scores using weighted factors:
- Title matches receive highest priority
- Category and tag matches provide strong signals
- Content matches are scored based on frequency and context
- Related pages are ranked by multiple relationship indicators

## Relationships

- **Depends on WikiManager** for accessing and managing wiki page data
- **Extends dashboard functionality** by adding sophisticated search and navigation features
- **Integrates with wiki metadata** structure including existing tags, categories, and page relationships

## Usage Example

```javascript
const WikiSearchService = require('./lib/wiki-search-service');

const searchService = new WikiSearchService(wikiManager);

// Search for pages
const searchResults = await searchService.searchWiki('javascript', { project: 'docs' });

// Extract table of contents
const toc = searchService.getTableOfContents(pageContent);

// Find related pages
const relatedPages = await searchService.getRelatedPages(currentPageId, { project: 'docs' });
```

## Testing

No automated tests are currently available for this component. Testing coverage should be added to verify search accuracy, relevance scoring, and relationship discovery functionality.