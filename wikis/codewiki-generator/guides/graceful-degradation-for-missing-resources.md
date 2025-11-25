---
title: Graceful degradation for missing resources
category: guide
sourceFile: lib/wiki-manager.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Graceful Degradation for Missing Resources

## Purpose and [Overview](../meta/overview.md)

The WikiManager implements graceful degradation patterns to handle missing files and resources without breaking the application flow. Instead of throwing exceptions when content cannot be found, the system returns null values or empty arrays, allowing calling code to continue operating while only propagating genuine system errors.

## Key Functionality

The graceful degradation strategy works through consistent error handling across all WikiManager methods:

- **File-not-found scenarios** return `null` for single page requests or empty arrays for collection requests
- **System errors** (permissions, disk issues, parsing failures) are propagated normally as exceptions
- **Search operations** return empty result sets rather than failing when no matches are found
- **Related page lookups** gracefully handle missing or malformed relationship metadata

This approach ensures that missing wiki content doesn't crash the application while preserving visibility into actual technical problems that need attention.

## Relationships

This error handling pattern integrates with all core WikiManager functionality:

- **Wiki file management**: File reading operations handle missing files gracefully
- **Hierarchical content discovery**: Directory traversal continues when individual files are missing
- **Search and relationship systems**: Missing content doesn't break search indexes or relationship graphs

The consistent null/empty return pattern creates a predictable API surface that other components can rely on without extensive error handling.

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const wikiManager = new WikiManager('./wiki-directory');

// Returns null instead of throwing when page doesn't exist
const page = await wikiManager.getPage('missing-file.md');
if (page) {
  console.log(page.metadata.title);
} else {
  console.log('Page not found, continuing...');
}

// Returns empty array when no pages exist or match criteria
const allPages = await wikiManager.getAllPages();
const searchResults = await wikiManager.searchPages('nonexistent term');
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Tests verify graceful degradation behavior alongside normal operation
- Covers missing file scenarios, empty search results, and malformed content handling