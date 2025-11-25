---
title: Search and discovery with snippet extraction
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Search and Discovery with Snippet extraction

## Purpose and Overview

The search and discovery component enables full-text search across wiki content with intelligent snippet extraction. It combines metadata matching and content matching into a unified search pattern that provides relevant excerpts to help users find and preview content across the wiki system.

## Key Functionality

This component provides comprehensive search capabilities that go beyond simple text matching:

- **Full-text search** across both frontmatter metadata and markdown content
- **Context-aware snippet extraction** that highlights relevant passages around search matches
- **Unified search results** that combine metadata and content matches into coherent results
- **Content preview generation** to help users identify relevant pages before navigating

The search process analyzes both the structured metadata (from YAML frontmatter) and the unstructured content text, extracting meaningful snippets that provide context around matched terms. This allows users to quickly assess relevance without opening individual pages.

## Relationships

This component builds upon and integrates with several other wiki management components:

- **Depends on Wiki content management with frontmatter parsing** - Uses parsed page data including separated metadata and content for targeted searching
- **Utilizes Recursive directory traversal for content discovery** - Searches across the complete catalog of discovered wiki pages
- **Supports Metadata-driven page relationships** - Search results can surface related pages through metadata connections
- **Integrates with the broader WikiManager system** - Provides search as a core service for wiki navigation and content discovery

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');

// Initialize wiki manager with directory path
const wikiManager = new WikiManager('./path/to/wiki');

// Search across all wiki pages
const searchResults = await wikiManager.searchPages('test query');

// Results include pages with extracted snippets showing matched content
console.log(searchResults); // Array of pages with relevant content snippets
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- Part of comprehensive WikiManager test suite with 17 test cases across 5 test suites
- Specific test coverage for `searchPages` functionality
- Integration testing with other WikiManager components (getPage, getAllPages, getRelatedPages)