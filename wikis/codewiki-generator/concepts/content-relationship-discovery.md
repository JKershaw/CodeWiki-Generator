---
title: Content relationship discovery
category: concept
sourceFile: lib/wiki-search-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Content Relationship Discovery

## Purpose and Overview

The Content Relationship Discovery system intelligently identifies and scores connections between wiki pages using multiple signals including explicit links, shared categories, common tags, and content references. This system enables rich wiki navigation experiences by surfacing related content and helping users discover relevant pages through automated relationship detection.

## Key Functionality

**Relationship Detection**: Analyzes multiple signals to identify page relationships:
- Explicit links between pages
- Shared categories and taxonomies
- Common tags and metadata
- Content references and mentions

**Relationship Scoring**: Uses weighted algorithms to rank relationship strength through `_calculateRelationScore`, considering factors like metadata overlap, link frequency, and content similarity.

**Integration with Search**: Works alongside the broader wiki search system to enhance discoverability, providing context-aware related page suggestions that complement search results.

**Intelligent Discovery**: Goes beyond simple link following to identify semantic relationships, enabling users to discover relevant content they might not have found through traditional navigation.

## Relationships

The Content Relationship Discovery system integrates deeply with the wiki infrastructure:
- **Depends on WikiManager** for accessing page content and metadata
- **Integrates with wiki metadata structure** including categories, tags, and explicit relations
- **Extends WikiSearchService** as part of the comprehensive search and navigation system
- **Enhances wiki navigation** by providing relationship-based page discovery alongside table of contents and search functionality

## Usage Example

```javascript
const WikiSearchService = require('./lib/wiki-search-service');

const searchService = new WikiSearchService(wikiManager);

// Discover related pages for a specific wiki page
const relatedPages = await searchService.getRelatedPages('javascript-basics');

// Related pages are returned with relationship scores
relatedPages.forEach(page => {
  console.log(`${page.title} (score: ${page.relationScore})`);
});
```

## Testing

No automated tests found for the relationship discovery functionality. Consider implementing tests to verify relationship scoring accuracy and performance with large page sets.