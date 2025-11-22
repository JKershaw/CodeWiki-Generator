---
title: Global metadata tracking system
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Global Metadata Tracking System

## Purpose and Overview

The global metadata tracking system provides centralized management of wiki page metadata and statistics through a persistent `_metadata.json` file. It enables system-wide analytics and page lifecycle tracking by maintaining both individual page metadata and aggregated statistics across the entire wiki.

## Key Functionality

### Metadata Storage Architecture

The system uses a hierarchical approach with two levels of metadata:

- **Page-level metadata**: Individual page information stored in the `pages` object
- **Global statistics**: Aggregated data including page counts by category and generation timestamps

### Core Operations

- **`loadGlobalMetadata()`** - Initializes or loads the global metadata file, creating default structure on first access
- **`saveGlobalMetadata()`** - Persists metadata changes to disk with formatted JSON output
- **`updatePageGlobalMetadata()`** - Updates individual page metadata and recalculates global statistics
- **`getPageGlobalMetadata()`** - Retrieves metadata for specific pages from the global store

### Automatic Statistics Calculation

The system automatically tracks:
- Total page counts by category
- Last generation timestamps
- Page creation and modification tracking

## Relationships

- **Extends WikiManager**: Adds persistent metadata capabilities to the core wiki management functionality
- **Complements frontmatter parsing**: Works alongside existing page-level metadata extraction to provide global context
- **Foundation for analytics**: Enables wiki statistics, reporting, and dashboard features

## Usage Examples

### Tracking Page Updates

```javascript
// Update metadata when a page is modified
await updatePageGlobalMetadata('user-guide', {
  category: 'guide',
  lastModified: new Date().toISOString(),
  wordCount: 1250
});
```

### Retrieving Page Information

```javascript
// Get metadata for a specific page
const pageMetadata = await getPageGlobalMetadata('api-reference');
console.log(pageMetadata.category, pageMetadata.lastModified);
```

### Accessing Global Statistics

```javascript
const metadata = await loadGlobalMetadata();
console.log(`Total guides: ${metadata.statistics.pagesByCategory.guide || 0}`);
```

The metadata file structure automatically maintains consistency between individual page data and aggregate statistics, ensuring accurate system-wide reporting without manual synchronization.