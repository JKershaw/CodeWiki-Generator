---
title: Content transformation contract
category: concept
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Content Transformation Contract

## Purpose and Overview

The content transformation contract defines how WikiManager converts markdown content to HTML during the retrieval process. This architectural decision moves rendering responsibility from content consumers to the WikiManager itself, enabling consistent HTML output and supporting sandbox environments for E2E testing.

## Key Functionality

The WikiManager implements a markdown-to-HTML rendering pipeline that transforms content at the retrieval stage:

- **Pipeline Processing**: Uses the marked library to convert markdown content to HTML when pages are requested
- **Contract Shift**: The `getPage()` method now returns pre-rendered HTML content instead of raw markdown
- **Centralized Rendering**: Content transformation occurs within the manager rather than requiring downstream consumers to handle rendering
- **Consistent Output**: All content consumers receive the same HTML format, eliminating rendering inconsistencies

## Relationships

This contract affects multiple system components:

- **WikiManager**: Primary implementer of the transformation contract, handling all markdown-to-HTML conversion
- **Playwright E2E Tests**: Benefits from pre-rendered HTML content that works seamlessly in sandbox environments  
- **Frontend Rendering**: Consumers now receive HTML instead of markdown, simplifying client-side processing
- **Content Pipeline**: Represents a fundamental shift in the data flow architecture from raw content serving to processed content delivery

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager with wiki directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Retrieve page - now returns HTML content instead of markdown
const page = await wikiManager.getPage('test-page.md');

// Access transformed content and metadata
console.log(page.metadata.title); // 'Test Page'
console.log(page.content); // HTML content (previously was markdown)
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Test categories: WikiManager, getPage, getAllPages, searchPages, getRelatedPages
- Validates content transformation behavior and contract compliance