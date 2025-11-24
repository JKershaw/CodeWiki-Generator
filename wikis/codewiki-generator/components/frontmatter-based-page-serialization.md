---
title: Frontmatter-based Page Serialization
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Frontmatter-based Page Serialization

## Purpose and Overview

This component provides the serialization logic that converts wiki page metadata and content into markdown files with YAML-style frontmatter headers. It enables structured storage of wiki pages by consistently formatting metadata at the top of each file, making pages both human-readable and machine-parseable.

## Key Functionality

The frontmatter serialization system handles the conversion between internal page objects and stored markdown files through the following operations:

- **`_serializePage(metadata, content)`** - Core serialization method that combines a metadata object and content string into a single markdown string with frontmatter header format
- **`createPage(path, content, metadata)`** - Creates new wiki pages with automatic timestamp generation (`createdAt`) and serializes them using frontmatter format
- **`updatePage(path, content, metadata)`** - Updates existing pages while preserving creation timestamps and automatically updating the `modifiedAt` timestamp
- **`updateMetadata(path, metadata)`** - Updates only page metadata while keeping content intact, useful for metadata-only changes
- **`deletePage(path)`** - Removes wiki pages from the filesystem with graceful error handling for missing files

All metadata is stored in ISO date format at the top of markdown files, creating a consistent structure that pairs with the existing `_parseFrontmatter()` read functionality.

## Relationships

This component operates as part of a symmetric read-write system:

- **Complements `_parseFrontmatter()`** - While parsing reads frontmatter from files, serialization writes it back in the same format
- **Builds on `getPage()`** - Write operations retrieve existing pages to validate changes and preserve timestamps
- **Uses shared `wikiPath`** - All serialized pages are stored in the base directory established during WikiManager initialization
- **Maintains metadata consistency** - Timestamps follow the same ISO format used throughout the codebase

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const wikiManager = new WikiManager('./wiki');

// Create a new page with automatic timestamp
await wikiManager.createPage('my-page.md', 'This is my content', {
  title: 'My Page',
  tags: ['tutorial']
});

// Update page content and merge metadata
await wikiManager.updatePage('my-page.md', 'Updated content', {
  tags: ['tutorial', 'updated']
});

// Update only metadata, preserving content
await wikiManager.updateMetadata('my-page.md', {
  status: 'published'
});

// Delete a page
await wikiManager.deletePage('my-page.md');
```

## Testing

This component is covered by 17 test cases across 5 test suites in `tests/unit/wiki-manager.test.js`, including specific tests for:

- Page creation with metadata and automatic timestamp generation
- Page updates with metadata merging and timestamp updates
- Metadata-only updates
- Page deletion with error handling
- Round-trip serialization and parsing consistency