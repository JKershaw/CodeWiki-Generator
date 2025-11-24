---
title: TDD-driven wiki formatting fixes
category: guide
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# TDD-driven wiki formatting fixes

## Purpose and Overview

This guide demonstrates a test-driven development approach for fixing critical wiki formatting issues by implementing content handling methods that ensure consistency between read and write operations. The solution introduces proper separation between raw markdown content and HTML-rendered content, enabling robust content editing and processing workflows.

## Key Functionality

The TDD approach focuses on:

- **Raw content handling**: Implementing `getRawPage()` method to retrieve unprocessed markdown content for editing workflows
- **Content consistency**: Ensuring that content formatting is preserved during metadata operations and content updates
- **Systematic testing**: Using comprehensive test suites to validate formatting fixes before implementation
- **Backward compatibility**: Maintaining existing functionality while adding new content handling capabilities

The implementation leverages existing utilities like `_parseFrontmatter()` to maintain consistent content parsing across different content access methods.

## Relationships

This approach builds upon and enhances existing wiki infrastructure:

- **Complements `getPage()`**: Works alongside the existing method that returns HTML-rendered content
- **Supports `updatePage()`**: Enables content updates that preserve original markdown formatting during metadata operations  
- **Utilizes existing parsing**: Relies on established `_parseFrontmatter()` utility for consistent content processing
- **Enhances content workflows**: Provides foundation for edit/preview cycles and content management operations

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager with test directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Test-driven approach: Write tests first
describe('WikiManager', () => {
  it('should read a markdown file with frontmatter', async () => {
    const page = await wikiManager.getPage('test-page.md');
    
    expect(page).toBeDefined();
    expect(page.metadata).toBeDefined();
    expect(page.content).toBeDefined();
    expect(page.metadata.title).toBe('Test Page');
  });
});
```

## Testing

**Test Coverage**: Comprehensive test suite in `tests/unit/wiki-manager.test.js`
- **17 test cases** across 5 test suites
- **Test categories**: WikiManager, getPage, getAllPages, searchPages, getRelatedPages
- **TDD methodology**: Tests written before implementation to ensure formatting requirements are met
- **Content validation**: Tests verify proper handling of frontmatter, markdown content, and metadata consistency