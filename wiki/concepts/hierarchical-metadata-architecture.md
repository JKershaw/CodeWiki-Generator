---
title: Hierarchical metadata architecture
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Hierarchical Metadata Architecture

The hierarchical metadata architecture provides a two-tier system for managing wiki page metadata, combining individual page-level data with aggregated global statistics. This system enables both granular page tracking and system-wide analytics through a centralized metadata store.

## Key Functionality

The architecture operates through a global `_metadata.json` file that maintains comprehensive tracking of all wiki pages while preserving individual page metadata. The system automatically:

- **Tracks page lifecycle** - Records creation timestamps, last modified dates, and page status changes
- **Aggregates statistics** - Calculates total page counts, categorizes content types, and maintains system-wide metrics
- **Manages metadata persistence** - Handles loading, updating, and saving of the global metadata store
- **Provides unified access** - Offers consistent interfaces for both reading and updating metadata

### Core Functions

- `loadGlobalMetadata()` - Initializes or loads the global metadata file with default structure
- `saveGlobalMetadata()` - Persists metadata changes with formatted JSON output
- `updatePageGlobalMetadata()` - Updates individual page data and recalculates global statistics
- `getPageGlobalMetadata()` - Retrieves specific page metadata from the global store

## Relationships

This architecture extends the WikiManager class by adding persistent metadata capabilities that complement existing frontmatter parsing. While frontmatter provides page-specific configuration, the global metadata system tracks cross-page relationships and system-wide statistics.

The hierarchical approach separates concerns between:
- **Page-level metadata** - Individual page properties, categories, and local configuration
- **Global aggregated data** - System statistics, page counts by type, and wiki-wide analytics

## Usage Examples

```javascript
// Update page metadata and recalculate global stats
await updatePageGlobalMetadata('getting-started', {
  category: 'documentation',
  lastModified: new Date().toISOString(),
  wordCount: 1250
});

// Retrieve specific page metadata
const pageData = await getPageGlobalMetadata('api-reference');
console.log(pageData.category, pageData.lastModified);

// Load current global statistics
const metadata = await loadGlobalMetadata();
console.log(`Total pages: ${metadata.statistics.totalPages}`);
```

The system automatically maintains consistency between individual page updates and global statistics, ensuring that changes to page metadata immediately reflect in system-wide counts and analytics.