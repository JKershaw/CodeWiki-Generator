---
title: Wiki markdown file management with frontmatter parsing
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Manager

## Purpose and Overview

WikiManager provides a unified interface for reading, indexing, and searching wiki markdown files while extracting and parsing YAML frontmatter metadata. It abstracts away file system operations and content parsing, enabling developers to work with wiki pages as structured objects with metadata and content.

## Key Functionality

WikiManager offers the following operations:

- **Page Retrieval** (`getPage`): Reads a single wiki page and returns its parsed metadata and content, with graceful handling of missing files
- **Content Discovery** (`getAllPages`): Recursively discovers and indexes all markdown pages in the wiki directory, building a searchable catalog
- **Full-Text Search** (`searchPages`): Searches across all pages by title and content with case-insensitive matching and snippet extraction for preview display
- **Related Pages** (`getRelatedPages`): Extracts related page references from a page's frontmatter metadata
- **Frontmatter Parsing** (`_parseFrontmatter`, `_parseFrontmatterYaml`): Parses YAML-style frontmatter blocks from markdown files and converts them into key-value metadata objects with support for array values

## Relationships

WikiManager uses Node.js `fs.promises` for asynchronous file I/O operations. Frontmatter parsing enables metadata-driven wiki organization and establishes page relationships through structured metadata fields. The search functionality depends on both the `getAllPages` indexing operation and individual page retrieval. The related pages feature requires frontmatter metadata field conventions to be followed (such as a `related` array field). Snippet extraction supports search result presentation by providing contextual previews around match locations.

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');

// Initialize with wiki directory path
const wikiManager = new WikiManager('./path/to/wiki');

// Read a single page with metadata
const page = await wikiManager.getPage('test-page.md');
console.log(page.metadata.title);  // Access frontmatter metadata
console.log(page.content);          // Access markdown content

// Index all pages in the wiki
const allPages = await wikiManager.getAllPages();

// Search for pages by title or content
const results = await wikiManager.searchPages('search term');
results.forEach(result => {
  console.log(result.title);
  console.log(result.snippet);  // Contextual snippet around match
});

// Get related pages from frontmatter
const relatedPages = await wikiManager.getRelatedPages('my-page.md');
```

## Testing

This component has comprehensive test coverage with 17 test cases across 5 test suites located in `tests/unit/wiki-manager.test.js`. Test categories include WikiManager initialization, `getPage` operations, `getAllPages` discovery, `searchPages` functionality, and `getRelatedPages` extraction. The tests validate frontmatter parsing, file handling, search accuracy, and metadata retrieval patterns.