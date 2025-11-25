---
title: Metadata management with automatic timestamps
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Metadata Management with Automatic Timestamps

## Purpose and Overview

This component handles automatic creation and updating of metadata timestamps for wiki pages, ensuring consistent tracking of when content is created and modified. It manages metadata merging strategies that preserve existing metadata values while allowing selective updates of specific fields.

## Key Functionality

The metadata management system provides:

- **Automatic timestamp generation** - Creates `createdAt` timestamps for new pages and updates `modifiedAt` timestamps when content changes
- **Metadata preservation** - Merges new metadata with existing values, maintaining data integrity during updates
- **Selective metadata updates** - Allows updating specific metadata fields without overwriting the entire metadata object
- **Consistent formatting** - Ensures timestamps follow a standardized format across all wiki pages

The component works in conjunction with the frontmatter serialization system, automatically injecting timestamp metadata when pages are created or modified through CRUD operations.

## Relationships

This component is tightly integrated with:

- **Wiki page CRUD operations** - Automatically applies timestamp metadata during create and update operations
- **Frontmatter-based page serialization** - Works with the `_serializePage()` method to embed metadata into YAML frontmatter
- **Safe file operations** - Coordinates with file handling to ensure metadata is properly saved alongside content changes

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const wikiManager = new WikiManager('./test-wiki');

// When creating or updating pages, timestamps are automatically managed
const page = await wikiManager.getPage('test-page.md');

// Metadata will include automatic timestamps
expect(page.metadata).toBeDefined();
expect(page.metadata.title).toBe('Test Page');
// Timestamps like createdAt and modifiedAt are automatically maintained
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Covers WikiManager core functionality including getPage, getAllPages, searchPages, and getRelatedPages operations
- Tests verify proper metadata handling and timestamp management integration