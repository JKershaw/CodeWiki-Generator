---
title: Direct file I/O with frontmatter parsing
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Direct File I/O with Frontmatter Parsing

## Purpose and Overview

This component provides direct file system operations for reading and parsing markdown files with YAML frontmatter metadata. It implements a separation of concerns approach that handles metadata updates independently from content retrieval, ensuring raw file content is processed without HTML conversion artifacts.

## Key Functionality

The component performs direct file I/O operations with specialized frontmatter parsing capabilities:

- **Raw File Reading**: Bypasses cached content retrieval to read files directly from the file system
- **Frontmatter Parsing**: Separates YAML metadata from markdown content during file processing
- **Metadata Preservation**: Maintains original markdown content structure when updating metadata
- **Explicit Error Handling**: Uses file system error codes (ENOENT) for reliable file-not-found detection
- **Content Isolation**: Prevents HTML conversion from interfering with metadata write operations

The implementation decouples metadata handling from content processing, allowing metadata updates to work with raw file content rather than processed HTML output.

## Relationships

This component is part of the WikiManager system and connects to:

- **File System Layer**: Directly interfaces with the underlying file system for I/O operations
- **Frontmatter Parser**: Integrates with YAML parsing libraries to extract and process metadata
- **WikiManager Core**: Serves as the underlying mechanism for page retrieval and metadata operations
- **Content Processing Pipeline**: Provides raw content that can be separately processed for HTML conversion

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager with test directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Read markdown file with frontmatter parsing
const page = await wikiManager.getPage('test-page.md');

expect(page.metadata).toBeDefined();
expect(page.content).toBeDefined();
expect(page.metadata.title).toBe('Test Page');
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Test categories: WikiManager initialization, getPage functionality, getAllPages operations, searchPages capabilities, and getRelatedPages relationships
- Comprehensive coverage of frontmatter parsing, file I/O operations, and error handling scenarios