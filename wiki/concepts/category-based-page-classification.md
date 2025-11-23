---
title: Category-based page classification
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Category-based Page Classification

Category-based page classification provides a systematic approach to organizing wiki pages into defined types (concepts, components, guides) with automated metadata tracking and statistics generation.

## Purpose and Overview

This system establishes a centralized metadata tracking framework that categorizes wiki pages and maintains real-time statistics about content distribution. It creates a unified view of wiki organization through a global `_metadata.json` file that tracks page relationships and content metrics.

## Key Functionality

### Metadata Management
- **Global tracking**: Maintains centralized metadata in `_metadata.json` with automatic fallback initialization
- **Page classification**: Categorizes pages as concepts, components, or guides
- **Statistics calculation**: Automatically updates category counts and distribution metrics
- **Persistence layer**: Handles loading and saving of metadata state

### Core Operations
- `loadGlobalMetadata()` - Retrieves existing metadata or creates default structure
- `saveGlobalMetadata()` - Persists metadata changes to disk
- `updatePageGlobalMetadata()` - Updates individual page metadata and recalculates global statistics
- `getPageGlobalMetadata()` - Fetches metadata for specific pages

### Classification Categories
- **Concepts**: High-level ideas, patterns, or architectural principles
- **Components**: Specific code elements, classes, or modules
- **Guides**: Step-by-step instructions or tutorials

## Relationships

This system extends the WikiManager class by adding metadata persistence capabilities on top of existing file system operations. It provides the foundation for wiki-wide analytics and organization features, enabling:

- Content organization and discovery
- Wiki health metrics and insights
- Automated content relationship mapping
- Foundation for future analytics features

## Usage Examples

### Updating Page Metadata
```javascript
// Classify a new page as a concept
await updatePageGlobalMetadata('design-patterns', {
  category: 'concept',
  title: 'Design Patterns',
  lastUpdated: new Date().toISOString()
});
```

### Retrieving Page Information
```javascript
// Get metadata for a specific page
const pageData = await getPageGlobalMetadata('design-patterns');
console.log(pageData.category); // 'concept'
```

The system automatically maintains category statistics, so adding or updating pages immediately reflects in global counts and distribution metrics without manual intervention.