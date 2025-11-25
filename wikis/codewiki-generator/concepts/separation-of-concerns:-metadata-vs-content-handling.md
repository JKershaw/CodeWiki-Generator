---
title: Separation of concerns: metadata vs content handling
category: concept
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Separation of Concerns: Metadata vs Content Handling

## Purpose and Overview

This architectural pattern ensures that metadata operations (frontmatter parsing and updates) are handled separately from content retrieval and processing. The separation prevents HTML conversion artifacts from corrupting metadata writes and provides more reliable file handling by working directly with raw markdown content rather than processed HTML.

## Key Functionality

The pattern implements distinct pathways for different types of operations:

- **Metadata Operations**: Uses direct file I/O with frontmatter parsing to read raw markdown files, preserving original content structure and preventing corruption during metadata updates
- **Content Retrieval**: Maintains separate methods for getting processed content (HTML conversion) versus raw content access
- **Error Handling**: Implements explicit file system error checking with ENOENT detection, allowing proper error propagation while handling missing files gracefully

The core improvement shifts away from using cached `getPage()` methods for metadata operations, instead parsing frontmatter directly from file content to maintain data integrity.

## Relationships

- **WikiManager Component**: Primary implementer of this separation pattern in `lib/wiki-manager.js`
- **File System Layer**: Directly interfaces with file I/O operations for metadata handling
- **Frontmatter Parser**: Works exclusively with raw markdown content to extract and update metadata
- **Content Processing Pipeline**: Operates independently from metadata operations to prevent cross-contamination

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize wiki manager
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Retrieve page with separated metadata and content
const page = await wikiManager.getPage('test-page.md');

expect(page.metadata).toBeDefined();
expect(page.content).toBeDefined();
expect(page.metadata.title).toBe('Test Page');
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Covers WikiManager, getPage, getAllPages, searchPages, and getRelatedPages functionality
- Validates that metadata and content are properly separated and accessible through the API