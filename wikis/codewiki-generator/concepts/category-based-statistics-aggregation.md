---
title: Category-based statistics aggregation
category: concept
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Category-based Statistics Aggregation

## Purpose and Overview

The category-based statistics aggregation system maintains real-time, wiki-wide statistics about documentation composition by automatically categorizing pages (concept, component, guide) and tracking them in a centralized `_metadata.json` file. This enables informed documentation management decisions by providing aggregated insights into the wiki's structure and category distribution.

## Key Functionality

The statistics aggregation system provides four core functions:

- **`loadGlobalMetadata()`** - Reads and parses the `_metadata.json` file from the wiki root, returning a default structure if the file doesn't exist. This initializes the global metadata store on startup.

- **`saveGlobalMetadata(metadata)`** - Persists the global metadata object to `_metadata.json` with formatted JSON output, ensuring statistics are durably stored.

- **`updatePageGlobalMetadata(pagePath, pageMetadata)`** - Updates or creates a page entry in global metadata and automatically recalculates category-based statistics. This is the primary integration point for keeping statistics current as pages are added or modified.

- **`getPageGlobalMetadata(pagePath)`** - Retrieves metadata for a specific page from the global metadata store, allowing inspection of individual page entries.

The system automatically maintains category counts for concept, component, and guide pages, enabling quick queries about wiki composition without scanning the entire document tree.

## Relationships

This component extends WikiManager's capabilities beyond individual page frontmatter by establishing a centralized metadata store. It integrates with the existing page processing workflow to maintain metadata accuracy whenever pages are created, updated, or deleted. The global metadata provides the foundation for wiki-wide reporting and analysis features, enabling developers to generate documentation health reports and category distribution analysis.

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const wikiManager = new WikiManager('./path/to/wiki');

// Load existing metadata or initialize with defaults
const metadata = wikiManager.loadGlobalMetadata();

// Update statistics when a page is processed
const pageMetadata = { title: 'My Component', category: 'component' };
wikiManager.updatePageGlobalMetadata('my-component.md', pageMetadata);

// Save updated statistics back to disk
wikiManager.saveGlobalMetadata(metadata);

// Retrieve metadata for a specific page
const pageData = wikiManager.getPageGlobalMetadata('my-component.md');
```

## Testing

The statistics aggregation system is covered by **17 test cases** across **5 test suites** in `tests/unit/wiki-manager.test.js`. Test coverage includes validation of metadata loading, saving, and page-specific metadata retrieval, ensuring the aggregation system maintains accuracy throughout wiki operations.