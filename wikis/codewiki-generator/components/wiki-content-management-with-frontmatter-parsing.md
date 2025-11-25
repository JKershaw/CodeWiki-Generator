---
title: Wiki content management with frontmatter parsing
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Wiki Content Management with Frontmatter Parsing

## Purpose and Overview

The WikiManager component provides structured reading and organization of markdown wiki pages with YAML frontmatter metadata. It serves as the foundational subsystem for wiki data management, enabling content discovery, search functionality, and relationship mapping across wiki directories.

## Key Functionality

- **Frontmatter Parsing**: Reads markdown files and extracts YAML frontmatter metadata alongside content
- **Recursive Directory Traversal**: Discovers and indexes all markdown files across nested wiki directory structures
- **Full-Text Search**: Enables content and metadata searching with context-aware snippet extraction
- **Page Relationships**: Leverages frontmatter metadata to establish connections between related wiki pages
- **Content Indexing**: Builds a comprehensive catalog of wiki pages for search and retrieval operations

The component combines metadata matching and content matching into a unified search pattern, providing relevant excerpts and maintaining knowledge graph connectivity without requiring explicit relationship storage.

## Relationships

This component acts as the foundation for other wiki features:
- **Search Systems**: Depends on the indexing and search capabilities
- **Navigation Components**: Relies on page discovery and relationship mapping
- **Content Display**: Uses the frontmatter parsing for metadata-driven presentation
- **Knowledge Graph Features**: Leverages the metadata-driven page relationships

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize with wiki directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Read a specific page with frontmatter
const page = await wikiManager.getPage('test-page.md');
console.log(page.metadata.title); // 'Test Page'
console.log(page.content); // markdown content

// Get all pages in the wiki
const allPages = await wikiManager.getAllPages();

// Search across content and metadata
const results = await wikiManager.searchPages('search term');

// Find related pages based on metadata
const related = await wikiManager.getRelatedPages('page-id');
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Test categories cover: WikiManager initialization, getPage functionality, getAllPages retrieval, searchPages operations, and getRelatedPages relationships
- Tests verify frontmatter parsing, content extraction, search capabilities, and metadata-driven relationships