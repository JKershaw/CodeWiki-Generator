---
title: Global metadata tracking system
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Global Metadata Tracking System

## Purpose and Overview

The global metadata tracking system provides centralized metadata management for wiki pages through a persistent `_metadata.json` file. It automatically maintains statistics about page types, orphaned pages, and overall wiki health to support monitoring and management operations.

## Key Functionality

The system extends the WikiManager class with four core functions that handle metadata persistence and calculation:

- **`loadGlobalMetadata()`** - Retrieves metadata from `_metadata.json` or initializes default structure
- **`saveGlobalMetadata(metadata)`** - Persists metadata object to disk
- **`updatePageGlobalMetadata(pagePath, pageMetadata)`** - Updates individual page metadata and recalculates global statistics
- **`getPageGlobalMetadata(pagePath)`** - Retrieves metadata for a specific page

### Automatic Statistics Calculation

The system automatically tracks:
- **Page counts by type** - Categorizes pages (concepts, components, guides, etc.)
- **Orphaned page detection** - Identifies pages without incoming links
- **Wiki health metrics** - Provides aggregate statistics for monitoring

Statistics are recalculated whenever page metadata is updated, ensuring real-time accuracy without manual intervention.

## Relationships

- **Extends WikiManager** - Adds metadata capabilities to existing page generation workflow
- **Complements page generation** - Metadata tracking occurs alongside normal wiki operations
- **Enables monitoring systems** - Provides data foundation for wiki health dashboards and reporting

## Usage Examples

### Basic Metadata Operations

```javascript
// Load existing metadata
const metadata = await loadGlobalMetadata();

// Update page metadata
await updatePageGlobalMetadata('concepts/authentication.md', {
  type: 'concept',
  lastModified: Date.now(),
  incomingLinks: ['guides/login-flow.md']
});

// Retrieve specific page metadata
const pageData = getPageGlobalMetadata('concepts/authentication.md');
```

### Accessing Statistics

```javascript
const metadata = await loadGlobalMetadata();
console.log(`Total pages: ${metadata.statistics.totalPages}`);
console.log(`Orphaned pages: ${metadata.statistics.orphanedPages}`);
console.log(`Concepts: ${metadata.statistics.pageTypes.concept || 0}`);
```

The metadata structure automatically maintains consistency and provides immediate access to wiki health metrics for monitoring and management purposes.