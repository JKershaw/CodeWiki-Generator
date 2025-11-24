---
title: Wiki health and quality analytics
category: concept
sourceFile: lib/wiki-analytics.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Health and Quality Analytics

## Purpose and Overview

The Wiki Analytics system provides comprehensive quality assessment and health metrics for wiki documentation. It analyzes wiki content to identify issues like orphaned pages, dead links, and content gaps that affect documentation discoverability and maintainability.

## Key Functionality

The `WikiAnalytics` class serves as the core analytics engine with the following capabilities:

- **Comprehensive Wiki Analysis** - Performs full-project analysis through `analyzeWiki()` to generate complete analytics data
- **Statistical Reporting** - Calculates aggregate statistics including categories, tags, link metrics, and overall health indicators via `getStatistics()`
- **Page-Level Metrics** - Generates detailed metrics for individual pages including word count, links, and heading analysis through `getPageMetrics()`
- **Quality Assessment** - Identifies documentation health issues:
  - Orphaned pages with no incoming links that may be hard to discover
  - Dead links pointing to non-existent pages
  - Link popularity analysis through incoming link counts
- **Content Parsing** - Extracts and analyzes both markdown and HTML links from page content

## Relationships

- **Depends on WikiManager** - Uses WikiManager to access wiki content and metadata for analysis
- **Extends Wiki System** - Adds analytical capabilities to the existing wiki infrastructure for quality assessment
- **Supports Dashboard Integration** - Provides data for enhanced dashboard displays and reporting features

## Usage Example

```javascript
const WikiAnalytics = require('./lib/wiki-analytics');

const analytics = new WikiAnalytics();
const analysisData = analytics.analyzeWiki(projectPath);

// Get aggregate statistics
const stats = analytics.getStatistics();

// Get metrics for individual pages
const pageMetrics = analytics.getPageMetrics();
```

## Testing

No automated tests are currently available for this component.