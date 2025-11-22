---
title: Automatic statistics calculation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Automatic Statistics Calculation

The automatic statistics calculation system maintains real-time metadata about wiki pages and generates aggregate statistics for monitoring wiki health. It tracks page categories, identifies orphaned content, and provides centralized metadata management through a persistent JSON store.

## Key Functionality

The system operates through four core functions that manage a global metadata store:

- **`loadGlobalMetadata()`** - Retrieves metadata from `_metadata.json` or initializes default structure
- **`saveGlobalMetadata()`** - Persists the current metadata state to disk
- **`updatePageGlobalMetadata()`** - Updates individual page metadata and recalculates global statistics
- **`getPageGlobalMetadata()`** - Retrieves metadata for a specific page

### Statistics Tracked

The system automatically calculates and maintains:
- Count of pages by category (concept, component, guide, etc.)
- Identification of orphaned pages (pages with no incoming links)
- Total page counts and metadata timestamps
- Cross-references between pages for link analysis

### Metadata Structure

All metadata is stored in `_metadata.json` with the following structure:
```json
{
  "pages": {
    "pageName": {
      "category": "concept|component|guide",
      "lastUpdated": "timestamp",
      "links": ["linkedPage1", "linkedPage2"]
    }
  },
  "statistics": {
    "totalPages": 0,
    "pagesByCategory": {},
    "orphanedPages": []
  }
}
```

## Relationships

This system extends the WikiManager class with persistent metadata capabilities. It complements the existing page generation workflow by automatically tracking metadata whenever pages are created or updated. The statistics serve as the foundation for wiki health monitoring and can inform decisions about content organization and maintenance.

## Usage Examples

The system works automatically during normal wiki operations:

```javascript
// Metadata is updated automatically when pages are processed
updatePageGlobalMetadata('myPage', {
  category: 'concept',
  links: ['relatedPage1', 'relatedPage2']
});

// Statistics are recalculated and persisted automatically
// Access current metadata for any page
const pageData = getPageGlobalMetadata('myPage');
```

The generated statistics enable monitoring of wiki health metrics like orphaned pages and category distribution without manual tracking.