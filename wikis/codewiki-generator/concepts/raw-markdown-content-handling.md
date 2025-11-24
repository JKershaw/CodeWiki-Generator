---
title: Raw markdown content handling
category: concept
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Raw Markdown Content Handling

## Purpose and Overview

The raw markdown content handling functionality provides access to wiki pages in their original markdown format, separate from HTML-rendered content. This enables content editing workflows and processing operations that need to work with the source markdown rather than the converted HTML output.

## Key Functionality

- **Raw Content Retrieval**: The `getRawPage()` method fetches wiki pages as unprocessed markdown content
- **Frontmatter Parsing**: Maintains consistent parsing of YAML frontmatter metadata while preserving original markdown formatting
- **Edit-Safe Operations**: Enables content modifications without losing markdown structure or formatting
- **TDD-Driven Fixes**: Supports systematic fixing of formatting issues through test-driven development approaches

## Relationships

This functionality complements the existing wiki content system:

- **Complements `getPage()`**: Works alongside the standard `getPage()` method which returns HTML-rendered content
- **Supports `updatePage()`**: Used by page update operations to preserve original markdown formatting during metadata operations
- **Utilizes `_parseFrontmatter()`**: Relies on the existing frontmatter parsing utility for consistent content processing across raw and rendered workflows

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Get raw markdown content for editing
const rawPage = await wikiManager.getRawPage('test-page.md');
console.log(rawPage.metadata.title); // Access frontmatter
console.log(rawPage.content); // Raw markdown content

// Compare with rendered content
const renderedPage = await wikiManager.getPage('test-page.md');
// renderedPage.content contains HTML, rawPage.content contains markdown
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Comprehensive coverage including WikiManager initialization, getPage, getAllPages, searchPages, and getRelatedPages functionality
- Test categories validate both raw content handling and HTML rendering workflows