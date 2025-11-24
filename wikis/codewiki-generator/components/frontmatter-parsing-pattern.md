---
title: Frontmatter Parsing Pattern
category: component
sourceFile: lib/wiki-manager.js
related: [meta/overview.md, components/wiki-markdown-management-system.md]
created: 2025-11-24
updated: 2025-11-24
---

# Frontmatter Parsing Pattern

## Purpose and [Overview](../meta/overview.md)

The Frontmatter Parsing Pattern implements custom YAML-like frontmatter parsing with support for metadata key-value pairs and array syntax. It enables structured metadata extraction from markdown files without external dependencies, providing a lightweight solution for parsing document headers in wiki systems.

## Key Functionality

- **Custom YAML Parser**: Parses frontmatter blocks delimited by `---` markers at the beginning of markdown files
- **Metadata Extraction**: Supports key-value pairs and array syntax for structured metadata
- **Array Syntax Support**: Handles both single-line and multi-line array formats in frontmatter
- **Dependency-Free**: Implements parsing logic without requiring external YAML libraries
- **Error Resilience**: Gracefully handles malformed or missing frontmatter blocks

The parser processes frontmatter by:
1. Detecting frontmatter boundaries with `---` delimiters
2. Parsing key-value pairs with support for strings, arrays, and nested structures
3. Returning structured metadata objects alongside content body
4. Maintaining compatibility with standard YAML frontmatter conventions

## Relationships

This pattern is a core component of the **[Wiki Markdown Management System](../components/wiki-markdown-management-system.md)**, working closely with:
- **WikiManager class**: Primary consumer that uses frontmatter parsing for all markdown file processing
- **Recursive Directory Traversal**: Parsing occurs during content discovery and indexing operations
- **Content Search**: Metadata extracted via frontmatter parsing enables enhanced search functionality
- **Graceful Error Handling**: Integrates with file operation error patterns for robust parsing

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');

// Initialize wiki manager with content directory
const wikiManager = new WikiManager('./wiki-content');

// Parse frontmatter and content from markdown file
const page = await wikiManager.getPage('test-page.md');

expect(page.metadata).toBeDefined();
expect(page.content).toBeDefined();
expect(page.metadata.title).toBe('Test Page');
```

## Testing

**Test Coverage**: `tests/unit/wiki-manager.test.js`
- 17 test cases across 5 test suites
- Comprehensive coverage of frontmatter parsing through WikiManager integration
- Test categories include page retrieval, content parsing, and metadata extraction
- Validates proper handling of various frontmatter formats and edge cases