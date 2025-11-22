---
title: Global metadata tracking
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Global Metadata Tracking

## Purpose and Overview

Global Metadata Tracking provides a centralized system for maintaining wiki-wide metadata and automatically calculating statistical information across all pages. This system enables efficient querying of wiki structure, supports reporting features, and serves as the foundation for wiki analytics and management tools.

## Key Functionality

### Core Operations

The system provides four primary functions for metadata management:

- **`loadGlobalMetadata()`** - Retrieves the global metadata from `_metadata.json`, creating a default structure if the file doesn't exist
- **`saveGlobalMetadata(metadata)`** - Persists the metadata object to disk with formatted JSON output
- **`updatePageGlobalMetadata(pageId, pageMetadata)`** - Updates individual page metadata and triggers automatic statistics recalculation
- **`getPageGlobalMetadata(pageId)`** - Retrieves metadata for a specific page from the global store

### Automatic Statistics Calculation

The system automatically maintains wiki-wide statistics whenever page metadata is updated:

- **Page counts by category** - Tracks how many pages exist in each category
- **Total commits processed** - Maintains a running count of wiki updates
- **Global metrics aggregation** - Computes summary statistics across all tracked pages

### Data Structure

The global metadata maintains:
```json
{
  "pages": {
    "pageId": { "title": "...", "category": "...", /* other metadata */ }
  },
  "statistics": {
    "totalPages": 0,
    "pagesByCategory": {},
    "totalCommits": 0
  }
}
```

## Relationships

- **Extends WikiManager** - Adds metadata capabilities to the existing WikiManager class using the same file system patterns
- **Integrates with page generation workflow** - Automatically updates metadata during wiki page processing
- **Supports frontmatter parsing** - Works with existing frontmatter functionality to extract page metadata
- **Enables reporting features** - Provides data foundation for wiki statistics and analytics

## Usage Examples

The metadata system operates automatically during wiki processing, but can also be used directly:

```javascript
// Update metadata for a specific page
await updatePageGlobalMetadata('concepts/metadata-tracking', {
  title: 'Global Metadata Tracking',
  category: 'concept',
  lastModified: new Date()
});

// Retrieve page metadata
const pageData = await getPageGlobalMetadata('concepts/metadata-tracking');

// Access global statistics
const metadata = await loadGlobalMetadata();
console.log(`Total pages: ${metadata.statistics.totalPages}`);
console.log(`Pages by category:`, metadata.statistics.pagesByCategory);
```

The system automatically handles file persistence and statistics recalculation, ensuring data consistency across all wiki operations.