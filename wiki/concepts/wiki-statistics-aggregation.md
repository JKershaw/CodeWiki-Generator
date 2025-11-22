---
title: Wiki statistics aggregation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Wiki Statistics Aggregation

## Purpose and Overview

The wiki statistics aggregation system provides centralized metadata tracking and automatic calculation of wiki metrics. It maintains a global `_metadata.json` file that tracks information about all pages in the wiki and calculates aggregate statistics like page counts by category and total commits processed.

## Key Functionality

### Global Metadata Management
- **Centralized storage**: Maintains all wiki metadata in a single `_metadata.json` file
- **Automatic fallback**: Creates default metadata structure when the file doesn't exist
- **Formatted persistence**: Saves metadata as properly formatted JSON for readability

### Statistics Calculation
- **Page counting**: Automatically tracks total number of pages in the wiki
- **Category aggregation**: Groups and counts pages by their assigned categories
- **Commit tracking**: Maintains running count of total commits processed

### Page-Level Operations
- **Individual page metadata**: Stores and retrieves metadata for specific wiki pages
- **Automatic updates**: Recalculates global statistics whenever page metadata changes
- **Seamless integration**: Works transparently with existing wiki page generation workflow

## Relationships

This system extends the existing `WikiManager` class and integrates deeply with the wiki generation process:

- **File system operations**: Uses the same file handling patterns as other WikiManager functions
- **Frontmatter integration**: Works with existing frontmatter parsing to extract page metadata
- **Workflow integration**: Automatically updates metadata during page generation without manual intervention
- **Statistics foundation**: Provides the data layer for wiki reporting and analytics features

## Usage Examples

### Reading Global Statistics
```javascript
const metadata = await wikiManager.loadGlobalMetadata();
console.log(`Total pages: ${metadata.stats.totalPages}`);
console.log(`Categories: ${Object.keys(metadata.stats.pagesByCategory).length}`);
```

### Updating Page Metadata
```javascript
// Automatically updates global stats when page metadata changes
await wikiManager.updatePageGlobalMetadata('concept-name', {
  category: 'architecture',
  lastModified: new Date().toISOString(),
  tags: ['core', 'system']
});
```

### Retrieving Specific Page Data
```javascript
const pageData = await wikiManager.getPageGlobalMetadata('wiki-statistics-aggregation');
if (pageData) {
  console.log(`Category: ${pageData.category}`);
  console.log(`Last modified: ${pageData.lastModified}`);
}
```

The system operates automatically during normal wiki operations, requiring minimal direct interaction while providing valuable insights into wiki structure and usage patterns.