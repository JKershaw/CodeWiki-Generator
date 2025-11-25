---
title: Frontmatter-based page serialization
category: component
sourceFile: lib/wiki-manager.js
related: [meta/overview.md]
created: 2025-11-24
updated: 2025-11-25
---

# Frontmatter-based Page Serialization

## Purpose and Overview

Frontmatter-based Page Serialization implements bidirectional conversion between metadata objects and markdown frontmatter format for wiki pages. The `_serializePage()` method complements the existing `_parseFrontmatter()` functionality, enabling structured metadata storage while maintaining markdown readability and human-editability.

## Key Functionality

This component handles the serialization of wiki page objects into markdown format with YAML frontmatter:

- **Metadata Serialization**: Converts page metadata objects into YAML frontmatter blocks enclosed by `---` delimiters
- **Content Preservation**: Maintains the original markdown content while updating metadata headers  
- **Structured Format**: Produces standardized markdown files that can be parsed by other markdown processors
- **Bidirectional Conversion**: Works alongside `_parseFrontmatter()` to enable round-trip serialization without data loss

The serialization process structures pages with frontmatter containing metadata (title, tags, timestamps) followed by the markdown content body, ensuring consistent file format across all wiki operations.

## Relationships

This component is tightly integrated with other WikiManager components:

- **[Wiki Page CRUD Operations](../components/wiki-page-crud-operations.md)**: Used by create, update, and delete operations to persist pages to disk in proper markdown format
- **[Metadata Management with Automatic Timestamps](../components/metadata-management-automatic-timestamps.md)**: Serializes automatically managed creation and modification timestamps along with other metadata
- **[Safe File Operations with Conflict Detection](../components/safe-file-operations-conflict-detection.md)**: Works within the defensive file operation framework for robust persistence
- **Frontmatter Parser**: Provides the inverse operation to `_parseFrontmatter()` for complete page lifecycle management

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const path = require('path');

// Initialize WikiManager with wiki directory
const testDir = path.join(__dirname, '../fixtures/test-wiki');
const wikiManager = new WikiManager(testDir);

// Read a page - demonstrates the parsing side of the serialization
const page = await wikiManager.getPage('test-page.md');

// The page object contains parsed frontmatter and content
expect(page.metadata.title).toBe('Test Page');
expect(page.content).toBeDefined();

// Serialization happens internally during write operations
// creating properly formatted markdown with YAML frontmatter
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`

- 17 test cases across 5 test suites (WikiManager, getPage, getAllPages, searchPages, getRelatedPages)
- Comprehensive testing of WikiManager functionality including frontmatter parsing and page structure handling
- Tests verify proper bidirectional conversion between page objects and markdown format, ensuring the serialization component maintains data integrity