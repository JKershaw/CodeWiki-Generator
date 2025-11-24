---
title: WikiAnalytics class
category: component
sourceFile: lib/wiki-analytics.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiAnalytics Class

## Purpose and Overview

The WikiAnalytics class provides comprehensive quality assessment and statistical analysis for wiki documentation systems. It identifies potential issues like orphaned pages and dead links while generating detailed metrics to help maintain documentation health and improve content discoverability.

## Key Functionality

The WikiAnalytics class offers several core capabilities:

- **Comprehensive Wiki Analysis** - Performs full-scale analysis of project wikis through the `analyzeWiki` method
- **Statistical Reporting** - Calculates aggregate statistics including categories, tags, link metrics, and overall health indicators via `getStatistics`
- **Page-Level Metrics** - Generates detailed metrics for individual pages including word count, links, and heading structure through `getPageMetrics`
- **Quality Assessment** - Identifies documentation health issues:
  - Orphaned pages that lack incoming links and may be hard to discover
  - Dead links pointing to non-existent pages
  - Link popularity analysis through incoming link counts
- **Content Parsing** - Extracts and analyzes both markdown and HTML links from page content

The analytics engine processes wiki content to provide actionable insights for documentation maintenance and improvement.

## Relationships

- **Depends on WikiManager** - Relies on WikiManager for accessing wiki content and metadata
- **Extends Wiki System** - Adds analytical capabilities to the existing wiki infrastructure for quality assessment
- **Dashboard Integration** - Supports enhanced dashboard functionality by providing comprehensive analytics data

## Usage Example

```javascript
const WikiAnalytics = require('./lib/wiki-analytics');

const analytics = new WikiAnalytics();
const analysisResults = analytics.analyzeWiki(projectData);

// Get aggregate statistics
const stats = analytics.getStatistics();

// Get metrics for individual pages
const pageMetrics = analytics.getPageMetrics();
```

## Testing

No automated tests are currently available for this component.