---
title: Centralized metadata tracking system
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Centralized Metadata Tracking System

## Purpose and Overview

The centralized metadata tracking system maintains a unified `_metadata.json` file that tracks page metadata, statistics, and relationships across the entire wiki. This system provides a foundation for wiki-wide analytics, content organization, and automated categorization tracking.

## Key Functionality

### Global Metadata Management

The system operates through four core functions that manage a centralized metadata store:

- **`loadGlobalMetadata()`** - Loads the global metadata file with automatic fallback to a default structure if the file doesn't exist
- **`saveGlobalMetadata(metadata)`** - Persists the metadata object to the `_metadata.json` file
- **`updatePageGlobalMetadata(pageName, pageMetadata)`** - Updates individual page metadata and recalculates global statistics
- **`getPageGlobalMetadata(pageName)`** - Retrieves stored metadata for a specific page

### Category-Based Classification

The system implements automatic categorization of wiki pages into three types:
- **Concepts** - Abstract ideas and principles
- **Components** - Concrete implementation elements
- **Guides** - Instructional and procedural content

Global statistics are automatically recalculated whenever page metadata is updated, providing real-time counts for each category.

### Metadata Structure

The global metadata file maintains:
```json
{
  "pages": {
    "pageName": { /* page-specific metadata */ }
  },
  "globalStats": {
    "totalPages": 0,
    "concepts": 0,
    "components": 0,
    "guides": 0
  }
}
```

## Relationships

This system extends the WikiManager class with persistent metadata capabilities, building on existing file system operations. It serves as the foundation for:

- Wiki-wide content analytics and reporting
- Automated page categorization and organization
- Cross-page relationship tracking
- Content discovery and navigation features

## Usage Examples

### Basic Metadata Operations

```javascript
// Load existing metadata
const metadata = await loadGlobalMetadata();

// Update a page's metadata
await updatePageGlobalMetadata('myPage', {
  category: 'concept',
  tags: ['system', 'core'],
  lastModified: new Date().toISOString()
});

// Retrieve specific page metadata
const pageData = await getPageGlobalMetadata('myPage');
```

The system automatically handles file creation, statistics updates, and ensures data consistency across all metadata operations.