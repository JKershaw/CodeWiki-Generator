---
title: _metadata.json file format
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# _metadata.json File Format

The `_metadata.json` file provides centralized metadata tracking for all wiki pages, maintaining global statistics and page lifecycle information in a structured JSON format.

## Purpose and Overview

This file serves as the single source of truth for wiki-wide metadata, automatically tracking page statistics, categories, and generation timestamps. It enables the wiki system to provide analytics, categorization insights, and page management capabilities without scanning individual files.

## File Structure

The metadata file follows a hierarchical structure separating global statistics from individual page data:

```json
{
  "generated": "2024-01-15T10:30:00.000Z",
  "statistics": {
    "totalPages": 42,
    "categories": {
      "concept": 15,
      "component": 20,
      "guide": 7
    }
  },
  "pages": {
    "path/to/page.md": {
      "title": "Page Title",
      "category": "concept",
      "lastModified": "2024-01-15T09:45:00.000Z",
      "abstraction": "medium"
    }
  }
}
```

## Key Functionality

### Global Statistics Tracking
- **Page Counts**: Automatically maintains total page count and breakdown by category
- **Category Distribution**: Tracks how pages are distributed across concept, component, and guide categories
- **Generation Timestamps**: Records when metadata was last updated

### Page-Level Metadata
- **Individual Tracking**: Stores metadata for each wiki page including title, category, and abstraction level
- **Modification Tracking**: Maintains last modified timestamps for change detection
- **Centralized Access**: Provides single point of access for all page metadata without file system scanning

## Relationships

- **Extends WikiManager**: Integrates with the core wiki management system to persist metadata alongside content generation
- **Complements Frontmatter**: Works alongside existing YAML frontmatter parsing to provide global aggregation of page-level data
- **Enables Analytics**: Serves as foundation for wiki statistics, reporting, and page discovery features

## Management Functions

The file is managed through dedicated functions that handle loading, updating, and persistence:

- `loadGlobalMetadata()` - Initializes or loads existing metadata with default structure
- `saveGlobalMetadata()` - Persists changes with formatted JSON output
- `updatePageGlobalMetadata()` - Updates individual pages and recalculates global statistics
- `getPageGlobalMetadata()` - Retrieves specific page metadata from the global store

This centralized approach ensures consistent metadata tracking and enables efficient wiki-wide operations without performance overhead from file system traversal.