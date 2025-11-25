---
title: Recursive Directory Traversal for Content Discovery
category: guide
sourceFile: lib/wiki-manager.js
related: [meta/overview.md]
created: 2025-11-24
updated: 2025-11-24
---

# Recursive Directory Traversal for Content Discovery

## Purpose and [Overview](../meta/overview.md)

This guide demonstrates a systematic approach to recursively discovering and indexing markdown files across nested directory structures while parsing metadata during traversal. It establishes the foundation for wiki page enumeration and search functionality by building a complete inventory of available content.

## Key Functionality

The recursive directory traversal pattern enables comprehensive content discovery by:

- **Walking Directory Trees**: Systematically exploring nested folder structures to locate all markdown files
- **In-Flight Metadata Parsing**: Extracting YAML frontmatter and content during the traversal process rather than in separate passes
- **Building Content Indexes**: Creating searchable catalogs of pages with their metadata for efficient retrieval
- **Filtering and Classification**: Identifying relevant content types while ignoring non-wiki files during discovery

The traversal process reads each discovered markdown file, parses its frontmatter for structured metadata (title, tags, categories), and builds an in-memory index that supports both direct page lookup and search operations across the entire wiki content structure.

## Relationships

This pattern serves as the foundation for several other wiki management components:

- **WikiManager Class**: Implements this traversal pattern as part of its core content discovery mechanism
- **Frontmatter Parsing**: Works in conjunction with YAML metadata extraction during file processing
- **Content Search**: Provides the indexed content that enables keyword search with context extraction
- **File Operation Error Handling**: Applies graceful error handling patterns during directory and file access

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize wiki manager with base directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Discover and retrieve all pages through traversal
const allPages = await wikiManager.getAllPages();
console.log(`Discovered ${allPages.length} wiki pages`);
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Comprehensive testing of WikiManager, getPage, getAllPages, searchPages, and getRelatedPages functionality
- Validates recursive discovery, metadata parsing, and content indexing behaviors