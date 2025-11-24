---
title: Wiki search and navigation system
category: concept
sourceFile: lib/wiki-search-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Search and Navigation System

## Purpose and Overview

The WikiSearchService provides advanced search capabilities, navigation features, and content discovery for wiki systems. It enables full-text search with relevance scoring, automatic table of contents generation from page headings, and intelligent discovery of related pages based on multiple relationship signals.

## Key Functionality

### Search Capabilities
- **Full-text search** across wiki pages with weighted relevance scoring
- **Multi-factor ranking** considering title matches, categories, tags, and content relevance
- **Search result snippets** to provide context for found content
- **Configurable search parameters** for customizing search behavior

### Navigation Features
- **Table of contents extraction** from HTML headings with automatic anchor generation
- **Related page discovery** using explicit links, shared categories, common tags, and content references
- **Relationship scoring** to rank the strength of connections between pages

### Content Analysis
- **Relevance calculation** with weighted factors for different content types
- **Content relationship detection** across multiple signals and metadata
- **Structured result formatting** for easy integration with UI components

## Relationships

The WikiSearchService integrates deeply with the wiki ecosystem:
- **Depends on WikiManager** for accessing page content and metadata
- **Leverages wiki metadata structure** including categories, tags, and explicit relations
- **Extends core wiki functionality** by adding search and navigation layers
- **Provides data for UI components** that display search results and navigation elements

## Usage Example

```javascript
const WikiSearchService = require('./lib/wiki-search-service');

// Initialize the search service
const searchService = new WikiSearchService(wikiManager);

// Perform a search with relevance scoring
const searchResults = await searchService.searchWiki('javascript functions', {
  limit: 10,
  includeSnippets: true
});

// Extract table of contents from a page
const toc = await searchService.getTableOfContents('page-id');

// Find related pages
const relatedPages = await searchService.getRelatedPages('page-id', { limit: 5 });
```

## Testing

No automated tests found for this component.