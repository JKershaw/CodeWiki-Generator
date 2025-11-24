---
title: Automatic Metadata Lifecycle Management
category: concept
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Automatic Metadata Lifecycle Management

## Purpose and Overview

The Automatic Metadata Lifecycle Management system automatically handles the creation and updating of metadata timestamps when wiki pages are created or modified. This ensures consistent, reliable metadata across all pages without requiring manual intervention, establishing a predictable pattern where system-managed fields like `created` and `updated` timestamps are always accurate and properly formatted.

## Key Functionality

The WikiManager implements complete write operations for wiki pages with built-in metadata management:

- **Page Creation** (`createPage`): Creates new wiki pages with automatic timestamp generation, preventing accidental overwrites of existing pages
- **Page Updates** (`updatePage`): Modifies both content and metadata while automatically updating the modified timestamp and merging new metadata with existing values
- **Metadata-Only Updates** (`updateMetadata`): Updates page metadata while preserving the original content
- **Page Deletion** (`deletePage`): Removes pages from the filesystem with graceful error handling for missing files
- **Serialization** (`_serializePage`): Converts metadata objects and content into markdown format with YAML-style frontmatter headers

All operations automatically manage timestamps in ISO 8601 date format, ensuring metadata consistency across the wiki without explicit user intervention.

## Relationships

- **Builds on read functionality**: Write operations leverage the existing `getPage()` method to retrieve current metadata for validation and merging
- **Complements parsing**: The `_serializePage()` method provides symmetric serialization to match the existing `_parseFrontmatter()` parsing functionality
- **Consistent metadata format**: All timestamps use ISO date format consistent with the existing page metadata structure
- **Unified storage**: All write operations use the same `wikiPath` base directory established during WikiManager initialization

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const wikiManager = new WikiManager('./wiki-content');

// Create a new page with automatic timestamp
await wikiManager.createPage('getting-started.md', 
  { title: 'Getting Started' }, 
  'Welcome to the wiki!'
);

// Update page content and metadata
await wikiManager.updatePage('getting-started.md',
  { title: 'Getting Started', tags: ['intro'] },
  'Welcome to our wiki! Here are the basics...'
);

// Update only metadata while preserving content
await wikiManager.updateMetadata('getting-started.md',
  { tags: ['intro', 'tutorial'] }
);

// Delete a page
await wikiManager.deletePage('getting-started.md');
```

## Testing

The WikiManager write operations are covered by 17 comprehensive test cases across 5 test suites in `tests/unit/wiki-manager.test.js`. Test coverage includes validation of:

- Frontmatter serialization and deserialization
- Timestamp generation and formatting
- Metadata merging during updates
- Prevention of file overwrites on creation
- Error handling for missing files during deletion and updates