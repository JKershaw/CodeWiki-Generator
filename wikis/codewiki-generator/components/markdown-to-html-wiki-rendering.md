---
title: Markdown-to-HTML wiki rendering
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Markdown-to-HTML Wiki Rendering

## Purpose and Overview

The WikiManager component transforms markdown files into HTML-ready content for web display. It extends basic file reading capabilities by integrating markdown parsing, converting raw markdown text to formatted HTML while preserving frontmatter metadata.

## Key Functionality

- **Markdown Processing**: Uses the `marked` library to convert markdown content to HTML via `marked.parse()`
- **Content Transformation**: Processes wiki files from raw markdown through frontmatter parsing to final HTML output
- **API Integration**: Changes the WikiManager contract to return HTML-formatted content instead of raw markdown
- **Asynchronous Parsing**: Handles markdown-to-HTML conversion asynchronously for non-blocking operations

The component maintains the existing frontmatter parsing functionality while adding a crucial rendering layer that prepares content for web consumption.

## Relationships

- **Integrates with existing WikiManager frontmatter parsing** - Works alongside metadata extraction to provide complete page processing
- **Supports Playwright E2E testing** - Provides HTML-ready content that can be directly tested in browser environments
- **Modifies WikiManager API contract** - Returns processed HTML content rather than raw markdown, affecting downstream consumers

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');

// Initialize with wiki directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Get processed page with HTML content
const page = await wikiManager.getPage('test-page.md');
// page.metadata contains frontmatter data (e.g., page.metadata.title)
// page.content contains HTML-rendered markdown
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Test categories: WikiManager, getPage, getAllPages, searchPages, getRelatedPages
- Validates both metadata extraction and content processing functionality