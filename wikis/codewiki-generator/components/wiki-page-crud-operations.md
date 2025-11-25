---
title: Wiki page CRUD operations
category: component
sourceFile: lib/wiki-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Wiki Page CRUD Operations

## Purpose and Overview

The WikiManager component provides comprehensive create, read, update, and delete operations for wiki pages stored as markdown files with YAML frontmatter. It extends basic wiki functionality to support full lifecycle management of wiki content, enabling both read-only access and content modification operations.

## Key Functionality

**Core CRUD Operations**
- **Create**: Generates new wiki pages with automatic metadata initialization and timestamp tracking
- **Read**: Parses existing markdown files, extracting YAML frontmatter metadata and content
- **Update**: Modifies existing pages while preserving metadata and updating timestamps
- **Delete**: Safely removes wiki pages with existence validation

**Content Processing**
- Bidirectional frontmatter handling through `_parseFrontmatter()` for reading and `_serializePage()` for writing
- Automatic conversion between markdown files and structured page objects
- YAML frontmatter parsing and generation for metadata storage

**Metadata Management**
- Automatic timestamp tracking for page creation (`createdAt`) and modification (`updatedAt`)
- Intelligent metadata merging that preserves existing values while allowing selective updates
- Flexible metadata structure supporting custom fields

**Safe File Operations**
- Existence checks before file creation to prevent overwrites
- Graceful error handling for operations on missing files
- Recursive directory creation to ensure valid file paths
- Defensive programming patterns throughout file system interactions

## Relationships

WikiManager serves as the central data access layer for wiki systems, interfacing with:
- **File System**: Direct markdown file manipulation with frontmatter processing
- **Search Components**: Provides searchable content through `searchPages()` method
- **Relationship Systems**: Supports related page discovery via `getRelatedPages()`
- **Wiki Applications**: Acts as the primary data provider for wiki interfaces and APIs

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager with wiki directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Read a wiki page with frontmatter
const page = await wikiManager.getPage('test-page.md');
console.log(page.metadata.title); // 'Test Page'
console.log(page.content); // Markdown content
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Comprehensive coverage of core functionality: WikiManager initialization, getPage, getAllPages, searchPages, and getRelatedPages operations
- Test categories validate both successful operations and error handling scenarios