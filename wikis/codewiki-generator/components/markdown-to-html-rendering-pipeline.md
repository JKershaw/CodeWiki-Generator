---
title: Markdown-to-HTML rendering pipeline
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Markdown-to-HTML Rendering Pipeline

## Purpose and Overview

The Markdown-to-HTML rendering pipeline transforms markdown content to HTML at the retrieval stage within WikiManager. This architectural shift moves content transformation responsibility from downstream consumers to the manager itself, enabling better support for E2E testing environments and consistent HTML delivery.

## Key Functionality

The pipeline operates through WikiManager's content retrieval methods, using the marked library to convert markdown to HTML during the `getPage()` operation. Key features include:

- **Automated HTML conversion** - Markdown content is transformed to HTML when pages are retrieved
- **Frontmatter preservation** - Page metadata is extracted and maintained separately from content transformation
- **Consistent output format** - All content consumers receive pre-rendered HTML instead of raw markdown
- **Pipeline integration** - Transformation occurs transparently within existing WikiManager methods

The rendering happens at the data access layer, ensuring that methods like `getPage()`, `getAllPages()`, and `searchPages()` all return HTML-transformed content while maintaining their existing API signatures.

## Relationships

This component integrates with several system elements:

- **WikiManager** - Hosts the rendering pipeline within its content retrieval methods
- **Playwright E2E tests** - Primary beneficiary of the HTML output for testing scenarios
- **Frontend rendering systems** - Receive pre-processed HTML instead of requiring client-side markdown parsing
- **Content storage layer** - Consumes raw markdown files and metadata from the filesystem
- **marked library** - External dependency providing the core markdown-to-HTML transformation

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager with wiki directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Retrieve page - returns HTML content instead of markdown
const page = await wikiManager.getPage('test-page.md');
// page.content now contains HTML, page.metadata contains frontmatter
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Coverage includes: WikiManager initialization, getPage functionality, getAllPages operations, searchPages capabilities, and getRelatedPages features
- Tests verify both metadata extraction and content transformation pipeline