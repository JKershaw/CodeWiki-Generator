---
title: Global metadata tracking system
category: component
sourceFile: lib/wiki-manager.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Global Metadata Tracking System

## Purpose and [Overview](../meta/overview.md)

The global metadata tracking system implements a centralized `_metadata.json` file that serves as a single source of truth for wiki-wide statistics, page inventory, and state management. This system enables efficient queries for aggregated metrics like total pages, category counts, and orphaned pages without requiring a full filesystem scan.

## Key Functionality

### Centralized Metadata Management
- Maintains a wiki-wide metadata file tracking all pages and their properties
- Automatically aggregates statistics by category (concept, component, guide)
- Provides real-time page inventory and classification data

### Metadata Lifecycle Operations
- **Loading**: Retrieves metadata with sensible defaults for missing entries
- **Updating**: Maintains per-page entries with timestamps and category information
- **Querying**: Enables fast lookups of individual page metadata and relationships

### Category-Based Organization
- Classifies pages into architectural categories (concept, component, guide)
- Enables navigation, filtering, and analytics based on page types
- Supports automated categorization and content organization

## Relationships

The global metadata tracking system integrates with:
- **Page Management**: Tracks all wiki pages and their frontmatter properties
- **Search System**: Provides indexed data for efficient content discovery
- **Navigation Components**: Supplies categorized page lists for menus and organization
- **Analytics Features**: Delivers aggregated statistics for wiki health monitoring

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize with wiki directory
const testDir = path.join(__dirname, 'wiki-content');
const wikiManager = new WikiManager(testDir);

// Read a page with metadata
const page = await wikiManager.getPage('test-page.md');
console.log(page.metadata.title); // "Test Page"
console.log(page.content); // Markdown content
console.log(page.metadata); // Frontmatter data
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- **Test Categories**: WikiManager initialization, getPage operations, getAllPages functionality, searchPages capabilities, and getRelatedPages relationships
- Comprehensive coverage of metadata loading, page reading, and cross-page relationship tracking