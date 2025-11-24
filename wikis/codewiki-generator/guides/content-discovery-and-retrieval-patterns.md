---
title: Content discovery and retrieval patterns
category: guide
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Content Discovery and Retrieval Patterns

## Purpose and Overview

WikiManager provides a unified interface for reading, indexing, and searching markdown-based wiki content. It handles YAML frontmatter parsing, full-text search capabilities, and related page discovery, enabling developers to build content-driven applications with minimal boilerplate. This component abstracts away filesystem complexity and metadata extraction, providing reliable content retrieval patterns across a wiki directory structure.

## Key Functionality

**File Management & Metadata Parsing**
- Reads individual markdown pages with graceful handling of missing files
- Extracts and parses YAML frontmatter blocks from markdown content
- Returns structured page objects containing both metadata and content

**Content Discovery**
- Recursively discovers and indexes all markdown files in the wiki directory
- Builds an in-memory index of pages for efficient querying
- Traverses nested directory structures automatically

**Search & Retrieval**
- Performs case-insensitive full-text search across page titles and content
- Extracts contextual snippets around search term matches for preview display
- Returns paginated search results with highlighted context

**Relationship Mapping**
- Extracts related page references from frontmatter metadata
- Enables navigation between conceptually connected pages
- Requires frontmatter `related` field conventions (space or comma-separated values)

## Relationships

WikiManager connects these key patterns:

- **Async file I/O**: Uses Node.js `fs.promises` for non-blocking file operations
- **Frontmatter conventions**: Depends on consistent YAML metadata structure in markdown files
- **Indexing strategy**: Full page discovery must complete before search operations execute
- **Search presentation**: Snippet extraction supports UI rendering of search results

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize with wiki directory
const wikiDir = path.join(__dirname, 'docs/wiki');
const wikiManager = new WikiManager(wikiDir);

// Retrieve a single page
const page = await wikiManager.getPage('getting-started.md');
console.log(page.metadata.title);      // "Getting Started"
console.log(page.content);             // markdown content

// Index all pages
const allPages = await wikiManager.getAllPages();
console.log(`Found ${allPages.length} pages`);

// Search across all content
const results = await wikiManager.searchPages('authentication');
results.forEach(result => {
  console.log(`${result.title}: ${result.snippet}`);
});

// Discover related pages
const related = await wikiManager.getRelatedPages('api-guide.md');
console.log(related);  // ['authentication.md', 'security.md']
```

## Frontmatter Format

Pages should use YAML frontmatter at the start of markdown files:

```markdown
---
title: My Page Title
related: authentication.md, security.md
tags: api, guide
---

# Content starts here
```

## Testing

WikiManager includes comprehensive test coverage with 17 test cases organized across 5 test suites:

- **getPage tests**: Single file retrieval and frontmatter parsing
- **getAllPages tests**: Directory traversal and indexing
- **searchPages tests**: Full-text search and snippet extraction
- **getRelatedPages tests**: Metadata relationship extraction
- Integration tests validating end-to-end workflows

Tests are located in `tests/unit/wiki-manager.test.js` and use fixtures from `fixtures/test-wiki`.