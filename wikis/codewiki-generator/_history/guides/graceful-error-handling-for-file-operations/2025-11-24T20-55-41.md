---
title: Graceful Error Handling for File Operations
category: guide
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Graceful Error Handling for File Operations

## Purpose and Overview

This guide demonstrates a pattern for handling file operation errors in wiki content management, specifically distinguishing between expected scenarios (missing files) and genuine errors. The pattern ensures predictable behavior when wiki pages don't exist while still surfacing actual I/O failures that require attention.

## Key Functionality

The graceful error handling pattern implements two distinct response strategies:

- **Expected scenarios**: When files don't exist (common in wiki operations), methods return `null` or empty results rather than throwing errors
- **Genuine errors**: Actual I/O failures, permission issues, or corruption problems are thrown as exceptions for proper error handling
- **Predictable behavior**: Calling code can safely check for null returns without wrapping every file operation in try-catch blocks
- **Error context preservation**: Real errors maintain their original context and stack traces for debugging

This approach prevents missing wiki pages from crashing the application while ensuring that actual system problems are properly reported and handled.

## Relationships

This error handling pattern integrates with several wiki management components:

- **WikiManager class**: Implements this pattern across all file reading methods (`getPage`, `getAllPages`)
- **Frontmatter Parsing Pattern**: Gracefully handles malformed YAML metadata without breaking page loading
- **Recursive Directory Traversal**: Continues processing when individual files are inaccessible while reporting genuine errors
- **Content Search**: Skips problematic files during search operations without terminating the entire search

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');

describe('WikiManager', () => {
  let wikiManager;
  let testDir;

  beforeEach(() => {
    testDir = path.join(__dirname, '../fixtures/test-wiki');
    wikiManager = new WikiManager(testDir);
  });

  describe('getPage', () => {
    it('should read a markdown file with frontmatter', async () => {
      const page = await wikiManager.getPage('test-page.md');

      expect(page).toBeDefined();
      expect(page.metadata).toBeDefined();
      expect(page.content).toBeDefined();
      expect(page.metadata.title).toBe('Test Page');
    });
  });
});
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Test categories cover WikiManager, getPage, getAllPages, searchPages, and getRelatedPages
- Error handling scenarios are validated to ensure proper distinction between missing files and actual errors