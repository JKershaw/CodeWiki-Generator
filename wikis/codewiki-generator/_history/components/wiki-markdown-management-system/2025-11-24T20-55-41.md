---
title: Wiki Markdown Management System
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Markdown Management System

## Purpose and Overview

The Wiki Markdown Management System provides a cohesive abstraction for reading, parsing, and searching wiki content stored as markdown files with YAML frontmatter. It establishes the core data access layer for wiki functionality, enabling structured metadata extraction and content discovery across nested directory structures.

## Key Functionality

- **Page Retrieval**: Reads individual markdown files and parses YAML frontmatter metadata alongside content
- **Content Discovery**: Recursively traverses directory structures to index all markdown files and their metadata
- **Search Capabilities**: Performs keyword searches across wiki content with context extraction, showing relevant snippets around matches
- **Related Content**: Identifies related pages based on shared metadata and content patterns
- **Error Handling**: Distinguishes between expected scenarios (missing files) and actual errors, returning null for missing pages while surfacing genuine I/O failures

The system implements custom YAML-like frontmatter parsing without external dependencies, supporting metadata key-value pairs and array syntax for structured content organization.

## Relationships

This component serves as the foundational data access layer for wiki applications. It connects to:
- File system operations for markdown file reading
- Content search and indexing systems
- Wiki page rendering components that consume parsed metadata and content
- Navigation systems that utilize the recursive directory traversal for page discovery

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize with wiki directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Get a specific page with metadata and content
const page = await wikiManager.getPage('test-page.md');
expect(page.metadata.title).toBe('Test Page');
expect(page.content).toBeDefined();

// Get all pages for navigation or indexing
const allPages = await wikiManager.getAllPages();

// Search content with context extraction
const searchResults = await wikiManager.searchPages('keyword');

// Find related content
const related = await wikiManager.getRelatedPages('page-id');
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Comprehensive coverage including: WikiManager initialization, getPage functionality, getAllPages directory traversal, searchPages content search, and getRelatedPages relationship detection
- Tests verify frontmatter parsing, error handling for missing files, and search result context extraction