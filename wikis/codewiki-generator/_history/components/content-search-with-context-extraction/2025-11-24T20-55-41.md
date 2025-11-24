---
title: Content Search with Context Extraction
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Content Search with Context Extraction

## Purpose and Overview

This component implements keyword search across wiki content with snippet extraction showing surrounding context. It combines full-text search capabilities with relevance display to enhance user experience when searching through markdown-based wiki pages.

## Key Functionality

The Content Search with Context Extraction component provides:

- **Keyword-based search** across all wiki pages and their content
- **Context snippet extraction** that shows surrounding text around search matches
- **Relevance-based results** with highlighted search terms in context
- **Multi-file search capabilities** that can search across entire wiki directories
- **Metadata integration** that includes frontmatter data in search results

The search algorithm scans through parsed markdown content, identifies keyword matches, and extracts surrounding text to provide meaningful context snippets. This allows users to quickly identify relevant pages and understand the context of their search terms before navigating to specific pages.

## Relationships

This component is part of the larger WikiManager system and connects to:

- **WikiManager class** - Acts as the primary interface for search operations
- **Frontmatter Parsing Pattern** - Leverages parsed metadata in search results
- **Recursive Directory Traversal** - Uses the indexed content for comprehensive search
- **Graceful Error Handling** - Implements consistent error handling patterns for search operations

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager with wiki directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Search for pages containing specific keywords
const searchResults = await wikiManager.searchPages('test keyword');

// Results include content with context snippets
console.log(searchResults); // Pages with matching content and surrounding context
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 total test cases across 5 test suites
- Comprehensive testing of search functionality through `searchPages` test suite
- Integration testing with other WikiManager components (`getPage`, `getAllPages`, `getRelatedPages`)
- Test fixtures located in `fixtures/test-wiki` directory for realistic testing scenarios