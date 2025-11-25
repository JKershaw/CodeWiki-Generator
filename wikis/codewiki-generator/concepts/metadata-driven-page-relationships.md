---
title: Metadata-driven page relationships
category: concept
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Metadata-driven page relationships

## Purpose and Overview

This concept establishes an architectural pattern where wiki pages can reference related content through frontmatter metadata, enabling knowledge graph connectivity within the wiki system. It allows pages to discover and link to other relevant content without requiring explicit relationship storage in a separate database.

## Key Functionality

The metadata-driven page relationship system works by:

- **Frontmatter Processing**: Extracts YAML metadata from markdown files to identify relationship indicators like tags, categories, or explicit references
- **Dynamic Discovery**: Uses metadata fields to automatically discover related pages based on shared attributes or explicit connections
- **Relationship Resolution**: Matches pages through their metadata properties to build contextual relationships
- **Knowledge Graph Formation**: Creates interconnected content networks based on metadata overlap and explicit references

This approach leverages the existing wiki content structure to build relationships organically through author-defined metadata rather than requiring separate relationship management.

## Relationships

This concept depends on and integrates with several core components:

- **Wiki content management with frontmatter parsing**: Relies on the metadata extraction capabilities to access relationship data
- **Recursive directory traversal for content discovery**: Uses the complete page catalog to resolve relationship references across the entire wiki
- **Search and discovery with snippet extraction**: May utilize search functionality to find related content based on metadata criteria

The relationship system serves as a foundation for building connected wiki experiences and knowledge discovery features.

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');

// Initialize wiki manager with content directory
const wikiManager = new WikiManager('./wiki-content');

// Get related pages based on metadata relationships
const relatedPages = await wikiManager.getRelatedPages('test-page.md');

// Access page metadata to understand relationships
const page = await wikiManager.getPage('test-page.md');
console.log(page.metadata.title); // "Test Page"
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Comprehensive testing of WikiManager functionality including getPage, getAllPages, searchPages, and getRelatedPages
- Tests verify metadata parsing, content retrieval, and relationship discovery capabilities