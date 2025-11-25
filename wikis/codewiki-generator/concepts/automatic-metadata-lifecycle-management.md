---
title: Automatic metadata lifecycle management
category: concept
sourceFile: lib/wiki-manager.js
related: [meta/overview.md]
created: 2025-11-24
updated: 2025-11-25
---

# Automatic Metadata Lifecycle Management

## Purpose and [Overview](../meta/overview.md)
Automatically manages temporal metadata (created and updated timestamps) during wiki page operations without requiring explicit caller management. This concept ensures consistency across all write operations and maintains a complete audit trail for page lifecycle tracking.

## Key Functionality

The automatic metadata lifecycle management provides:

- **Timestamp Management**: Automatically sets `created` timestamps for new pages and updates `updated` timestamps for modified pages during write operations
- **Metadata Merging**: Intelligently merges existing metadata with new metadata during page updates, preserving important fields while allowing modifications
- **Lifecycle Tracking**: Maintains complete audit trail of page creation and modification times without manual intervention from calling code
- **Transparent Operation**: Works behind the scenes during page creation, updates, and serialization without exposing complexity to callers
- **Consistency Enforcement**: Ensures all write operations include proper temporal metadata regardless of the calling context

The system integrates with frontmatter-based serialization to persist metadata alongside page content, ensuring temporal information survives across read/write cycles and remains accessible for future operations.

## Relationships

This concept depends on and integrates with:

- **[Wiki Page Write Operations](../components/wiki-page-write-operations.md)**: Provides the metadata management layer for all CRUD write operations (create, update, delete)
- **[Frontmatter-based Page Serialization](../components/frontmatter-based-page-serialization.md)**: Ensures temporal metadata is properly serialized and persisted in markdown frontmatter format
- **[Safe File Operation Pattern](../guides/safe-file-operation-pattern.md)**: Works within the defensive programming pattern to handle metadata even when file operations encounter edge cases

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const wikiManager = new WikiManager('./test-wiki');

// Metadata lifecycle is handled automatically during page operations
const page = await wikiManager.getPage('test-page.md');

// Created and updated timestamps are automatically managed
expect(page.metadata).toBeDefined();
expect(page.metadata.title).toBe('Test Page');
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Tests verify metadata persistence through WikiManager operations
- Coverage includes getPage, getAllPages, searchPages, and getRelatedPages functionality
- Validates that temporal metadata survives read/write cycles and is properly maintained