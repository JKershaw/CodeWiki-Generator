---
title: Recursive directory traversal for content discovery
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Recursive Directory Traversal for Content Discovery

## Purpose and Overview

Provides the mechanism to discover and index all markdown files across nested wiki directory structures. This component enables systematic exploration of wiki content hierarchies, building the foundational page catalog that powers search and retrieval operations throughout the wiki system.

## Key Functionality

- **Recursive File Discovery**: Traverses nested directory structures to locate all markdown files within the wiki
- **Content Indexing**: Builds a comprehensive catalog of available pages for use by other wiki operations
- **Path Resolution**: Maintains proper file path references for content retrieval and linking
- **Directory Structure Mapping**: Creates an internal representation of the wiki's organizational structure

The traversal process systematically walks through the wiki directory tree, identifying markdown files at any depth level and making them available for content management operations.

## Relationships

This component serves as a foundational layer for the wiki management system:

- **Enables Wiki Content Management**: Provides the file discovery needed for frontmatter parsing and page organization
- **Powers Search Operations**: Supplies the complete page inventory required for search indexing and snippet extraction
- **Supports Relationship Mapping**: Makes all pages discoverable for metadata-driven page relationship analysis
- **Feeds Content Retrieval**: Ensures all wiki pages are accessible through the `getPage` and `getAllPages` operations

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize wiki manager with directory path
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Directory traversal happens automatically during initialization
// Access discovered pages through getAllPages
const allPages = await wikiManager.getAllPages();
```

## Testing

**Test Coverage**: tests/unit/wiki-manager.test.js
- 17 test cases across 5 test suites
- Tests verify proper page discovery and retrieval functionality
- Coverage includes WikiManager initialization, getPage, getAllPages, searchPages, and getRelatedPages operations