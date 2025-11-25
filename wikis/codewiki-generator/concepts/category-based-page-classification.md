---
title: Category-based page classification
category: concept
sourceFile: lib/wiki-manager.js
related: [meta/overview.md, components/global-metadata-tracking-system.md, guides/metadata-lifecycle-management.md]
created: 2025-11-25
updated: 2025-11-25
---

# Category-based Page Classification

## Purpose and [Overview](../meta/overview.md)

The category-based page classification system establishes a structured approach for organizing wiki pages into distinct types: concept, component, and guide. This classification enables automatic aggregation of statistics by category, facilitating navigation, filtering, and analytics across the wiki's knowledge base.

## Key Functionality

The classification system works through frontmatter metadata in wiki pages, where each page is assigned a category type. The WikiManager automatically tracks and aggregates statistics for each category, providing:

- **Automated categorization** - Pages are classified based on their frontmatter metadata
- **Category statistics** - Automatic counting and tracking of pages by category type
- **Enhanced navigation** - Filtered views and organization based on page categories
- **Analytics support** - Aggregated metrics enable insights into wiki structure and content distribution

The system integrates with the global metadata tracking to maintain category counts without requiring full wiki scans, ensuring efficient queries and reporting.

## Relationships

This concept is implemented within the **[Global metadata tracking system](../components/global-metadata-tracking-system.md)** component, which maintains centralized statistics in `_metadata.json`. It works alongside **[Metadata lifecycle management](../guides/metadata-lifecycle-management.md)** to ensure category information is properly maintained throughout page creation, updates, and deletions. The classification system serves as a foundational organizational principle that other wiki features can leverage for content discovery and management.

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager
const testDir = path.join(__dirname, 'wiki-content');
const wikiManager = new WikiManager(testDir);

// Get a page and examine its category classification
const page = await wikiManager.getPage('test-page.md');
console.log(page.metadata.title); // 'Test Page'
console.log(page.metadata.category); // 'concept', 'component', or 'guide'
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Test categories: WikiManager, getPage, getAllPages, searchPages, getRelatedPages
- Validates page retrieval with frontmatter parsing and category metadata handling