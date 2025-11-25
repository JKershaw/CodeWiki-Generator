---
title: Explicit error handling with file system error codes
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Explicit Error Handling with File System Error Codes

## Purpose and Overview

This component implements explicit file system error handling with specific ENOENT (file not found) detection in the WikiManager's file operations. It replaces implicit error handling patterns with explicit error code checking, providing more reliable file-not-found detection while allowing other file system errors to propagate properly for appropriate handling.

## Key Functionality

- **Explicit ENOENT Detection**: Specifically catches and handles file-not-found errors using explicit error code comparison rather than generic try-catch patterns
- **Error Propagation**: Allows non-ENOENT file system errors to bubble up to calling code for proper handling
- **Reliable File Operation Status**: Provides deterministic behavior when checking for file existence during read/write operations
- **Integration with Direct File I/O**: Works in conjunction with direct file reading operations to ensure metadata updates can distinguish between missing files and other I/O errors

## Relationships

- **Supports Direct File I/O Component**: Enables reliable error handling for direct file reading operations used in frontmatter parsing
- **Enhances Metadata vs Content Separation**: Provides the error handling foundation that allows metadata operations to work independently from content retrieval
- **Core WikiManager Functionality**: Integrates with page retrieval, metadata updates, and file system operations throughout the WikiManager class

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');

// Initialize WikiManager
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// File operations with explicit error handling
try {
  const page = await wikiManager.getPage('test-page.md');
  console.log(page.metadata.title); // 'Test Page'
} catch (error) {
  // ENOENT errors handled explicitly, other errors propagated
  if (error.code === 'ENOENT') {
    console.log('File not found');
  } else {
    throw error; // Re-throw non-file-not-found errors
  }
}
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Tests cover WikiManager core functionality including getPage, getAllPages, searchPages, and getRelatedPages operations
- Validates error handling behavior in file system operations and metadata parsing scenarios