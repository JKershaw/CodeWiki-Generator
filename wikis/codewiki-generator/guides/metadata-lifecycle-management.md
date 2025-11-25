---
title: Metadata lifecycle management
category: guide
sourceFile: lib/wiki-manager.js
related: [meta/overview.md, components/global-metadata-tracking-system.md, concepts/category-based-page-classification.md]
created: 2025-11-25
updated: 2025-11-25
---

# Metadata Lifecycle Management

## Purpose and [Overview](../meta/overview.md)

Metadata lifecycle management provides a comprehensive system for tracking, updating, and querying wiki page metadata throughout the entire lifecycle of wiki operations. This system ensures consistent metadata maintenance and enables efficient wiki-wide analytics without requiring full file system scans.

## Key Functionality

The metadata lifecycle management system operates through three core operations:

- **Loading**: Retrieves metadata from the centralized `_metadata.json` file with sensible defaults when the file doesn't exist or entries are missing
- **Updating**: Maintains per-page metadata entries with automatic timestamp tracking whenever pages are modified or accessed
- **Querying**: Provides efficient access to individual page metadata without requiring file system operations

The system maintains a centralized metadata store that tracks:
- Page inventory and statistics
- Category-based classifications (concept, component, guide)
- Aggregated metrics like total pages and orphaned page counts
- Individual page metadata with timestamps

## Relationships

This component serves as the foundation for several other wiki systems:

- **[Global metadata tracking system](../components/global-metadata-tracking-system.md)**: Provides the underlying data structure and persistence layer
- **[Category-based page classification](../concepts/category-based-page-classification.md)**: Relies on the lifecycle management to maintain category statistics and page classifications
- **WikiManager**: Uses this system to provide consistent metadata operations across all wiki functionality

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager.js');
const path = require('path');

// Initialize with wiki directory
const testDir = path.join(__dirname, 'fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Load page with metadata lifecycle management
const page = await wikiManager.getPage('test-page.md');
console.log(page.metadata.title); // "Test Page"
console.log(page.content); // Parsed markdown content
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Comprehensive coverage including WikiManager initialization, page retrieval, search functionality, and related page queries
- Test categories cover core metadata operations: getPage, getAllPages, searchPages, and getRelatedPages