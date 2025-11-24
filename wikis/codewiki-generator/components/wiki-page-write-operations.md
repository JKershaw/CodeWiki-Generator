---
title: Wiki Page Write Operations
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Page Write Operations

## Purpose and Overview

Wiki Page Write Operations provide complete CRUD capabilities for creating, updating, and deleting wiki pages stored as markdown files with YAML frontmatter. This component automates metadata lifecycle management, including timestamp generation and serialization, ensuring consistent and structured page storage across the wiki system.

## Key Functionality

### Write Operations

The component implements four primary write functions:

- **createPage()** - Creates a new wiki page with content and metadata. Prevents accidental overwrites and automatically generates a `created` timestamp in ISO format.

- **updatePage()** - Updates both content and metadata of an existing page. Merges new metadata with existing metadata while automatically updating the `modified` timestamp.

- **updateMetadata()** - Updates only a page's metadata while preserving its existing content. Useful for updating metadata fields without touching the content body.

- **deletePage()** - Deletes a wiki page from the filesystem, gracefully handling cases where the file doesn't exist.

### Serialization

- **_serializePage()** - Converts a metadata object and content string into markdown format with YAML frontmatter. This internal method ensures symmetric processing with the existing `_parseFrontmatter()` parser.

### Metadata Management

All write operations automatically manage timestamps:
- `created` is set only on page creation
- `modified` is updated on every page modification
- Timestamps follow ISO 8601 date format consistent with existing page metadata structure

## Relationships

Write operations build upon existing read functionality from the WikiManager component:

- Leverages `getPage()` for metadata retrieval and validation before updates
- Uses `_parseFrontmatter()` for symmetric markdown processing (parse/serialize pair)
- Follows the same metadata schema and ISO date format conventions
- All operations use the `wikiPath` base directory established during WikiManager initialization

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

const wikiManager = new WikiManager(path.join(__dirname, 'my-wiki'));

// Create a new page
await wikiManager.createPage('new-page.md', {
  title: 'My New Page',
  tags: ['documentation']
}, 'This is the page content.');

// Update both content and metadata
await wikiManager.updatePage('new-page.md', {
  title: 'Updated Title',
  tags: ['documentation', 'updated']
}, 'Updated page content.');

// Update only metadata
await wikiManager.updateMetadata('new-page.md', {
  status: 'published'
});

// Delete a page
await wikiManager.deletePage('new-page.md');
```

## Testing

Test coverage is provided by `tests/unit/wiki-manager.test.js` with 17 test cases across 5 test suites. Tests validate page creation with metadata preservation, content updates, timestamp management, and file system operations including graceful handling of edge cases.