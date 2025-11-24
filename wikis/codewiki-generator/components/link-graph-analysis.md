---
title: Link Graph Analysis
category: component
sourceFile: lib/wiki-analytics.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Link Graph Analysis

## Purpose and Overview

The Link Graph Analysis component provides comprehensive wiki health monitoring through link relationship analysis and content statistics. It identifies problematic patterns like orphaned pages and dead links while generating detailed metrics to help maintain wiki quality and connectivity.

## Key Functionality

The component centers around the `WikiAnalytics` class, which provides two main analysis functions:

- **`analyzeWiki(projectId)`** - Generates comprehensive analytics including overall statistics and detailed page metrics
- **Link Graph Analysis** - Analyzes internal link relationships to identify:
  - Orphaned pages (pages with no incoming links)
  - Dead links (links pointing to non-existent pages)  
  - Page connectivity metrics and link counts
  - Update frequency patterns by month

The system processes both markdown and HTML link formats, normalizing them for accurate cross-referencing and relationship mapping.

## Relationships

- **Depends on WikiManager** - Accesses wiki page data and retrieval functionality
- **Extends wiki system** - Adds analytical capabilities to existing wiki infrastructure
- **Provides data layer** - Supports dashboard enhancements and monitoring features

## Usage Example

```javascript
const WikiAnalytics = require('./lib/wiki-analytics');

const analytics = new WikiAnalytics();
const results = await analytics.analyzeWiki('project-123');

// Access overall statistics
console.log(`Total pages: ${results.statistics.totalPages}`);
console.log(`Orphaned pages: ${results.statistics.orphanedPages.length}`);
console.log(`Dead links found: ${results.statistics.deadLinks.length}`);

// Access individual page metrics
results.pageMetrics.forEach(page => {
  console.log(`${page.path}: ${page.wordCount} words, ${page.incomingLinks} links`);
});
```

## Testing

No automated tests found - testing coverage needs to be established for this component.