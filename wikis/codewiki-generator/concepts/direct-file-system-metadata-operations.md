---
title: Direct file system metadata operations
category: concept
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Direct File System Metadata Operations

## Purpose and Overview

Direct file system metadata operations provide a way to update page metadata by bypassing cached page objects and working directly with raw markdown files. This approach preserves original markdown content and avoids data transformation issues that can occur when using cached page objects for metadata updates.

## Key Functionality

The core functionality centers around the `updateMetadata` function, which:

- Directly reads raw file content from the file system instead of using cached page objects
- Parses frontmatter to extract existing metadata and content using `_parseFrontmatter`
- Merges new metadata with existing metadata
- Writes the updated metadata back to files while preserving the original markdown content structure using `_serializePage`

This direct approach ensures that the original formatting and structure of markdown files remain intact during metadata operations, preventing corruption or unwanted transformations that might occur through the standard page object pipeline.

## Relationships

- **Uses `_parseFrontmatter`**: Extracts metadata and content from raw markdown files
- **Uses `_serializePage`**: Serializes updated metadata back to file format
- **Replaces `getPage()` dependency**: Bypasses the standard page object retrieval method to work directly with file system
- **Integrates with WikiManager**: Part of the broader wiki management system for handling page operations

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager with test directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Read a page with frontmatter metadata
const page = await wikiManager.getPage('test-page.md');
console.log(page.metadata.title); // 'Test Page'
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Test categories include: WikiManager, getPage, getAllPages, searchPages, getRelatedPages
- Tests verify proper handling of markdown files with frontmatter and metadata extraction