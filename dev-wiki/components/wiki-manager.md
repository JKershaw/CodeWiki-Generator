---
title: WikiManager
created: 2025-11-22
updated: 2025-11-22
related: [StateManager, Architecture]
---

# WikiManager

The WikiManager handles all wiki file operations - reading, writing, searching, and managing markdown files with frontmatter metadata.

## Purpose

WikiManager provides a clean API for interacting with the wiki filesystem, abstracting away the details of file I/O, frontmatter parsing, and directory management.

## Location

`lib/wiki-manager.js`

## Key Features

### Read Operations

**getPage(filePath)**
- Reads a markdown file and parses frontmatter
- Returns `{ path, metadata, content }` or `null` if not found
- Handles subdirectories automatically

**getAllPages()**
- Recursively collects all `.md` files
- Returns array of `{ path, metadata }`
- Useful for building navigation or indexes

**searchPages(keywords)**
- Searches both content and metadata
- Case-insensitive matching
- Returns results with snippets around matches
- Limited to relevant context (100 chars before/after)

**getRelatedPages(filePath)**
- Reads page's `related` frontmatter field
- Returns up to 3 related page references
- Used for providing context to AI agents

### Write Operations

**createPage(filePath, content, metadata)**
- Creates new markdown file with frontmatter
- Auto-generates timestamps if not provided
- Creates parent directories as needed
- Throws error if file already exists

**updatePage(filePath, content, metadata)**
- Updates existing page or creates new one
- Preserves existing frontmatter unless overridden
- Auto-updates `updated` timestamp
- Merges new metadata with existing

**updateMetadata(filePath, metadata)**
- Updates only metadata, preserves content
- Useful for adding tags or updating relationships
- Updates `updated` timestamp

**deletePage(filePath)**
- Removes page from filesystem
- Gracefully handles non-existent files

## Frontmatter Format

Pages use YAML-like frontmatter:

```markdown
---
title: Page Title
created: 2025-11-22
updated: 2025-11-22
related: [OtherPage, AnotherPage]
tags: [important, core]
---

## Content starts here

Markdown content...
```

### Supported Metadata Fields

- **title**: Page title (string)
- **created**: Creation date YYYY-MM-DD (string)
- **updated**: Last update date YYYY-MM-DD (string)
- **related**: Related page names (array)
- **tags**: Custom tags (array)

Arrays are formatted as `[item1, item2, item3]`.

## Implementation Details

### Frontmatter Parsing

Uses regex to extract frontmatter between `---` delimiters:

```javascript
const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
```

Parses simple YAML subset:
- `key: value` for strings
- `key: [val1, val2]` for arrays

### Snippet Extraction

For search results, extracts 100 characters before and after the match, adding `...` for truncation.

### Directory Handling

All directory creation uses `recursive: true`, so deeply nested paths work automatically.

## Testing

**Tests**: `tests/unit/wiki-manager.test.js`, `tests/unit/wiki-manager-write.test.js`

**Coverage**: 34 tests covering:
- Frontmatter parsing (with and without)
- Subdirectory handling
- Search (case-insensitive, snippets)
- Related pages (limiting to 3)
- Create/update/delete operations
- Concurrent writes
- Edge cases (empty dirs, non-existent files)

## Usage Example

```javascript
const WikiManager = require('./lib/wiki-manager');
const wikiManager = new WikiManager('./wiki');

// Create a new page
await wikiManager.createPage('concepts/architecture.md',
  '## System Overview\n\nThe system uses...',
  {
    title: 'Architecture',
    related: ['Components', 'Design Patterns']
  }
);

// Search pages
const results = await wikiManager.searchPages('authentication');
// [ { path: '...', metadata: {...}, matches: '...auth...' } ]

// Update page
await wikiManager.updatePage('concepts/architecture.md',
  'Updated content',
  { tags: ['core'] }
);
```

## Design Decisions

### Why Markdown + Frontmatter?

- **Human-readable**: Can be edited directly in any text editor
- **Git-friendly**: Plain text, easy to diff and version control
- **Portable**: No database dependency
- **Standard**: Many tools support frontmatter (Jekyll, Hugo, etc.)

### Why Limit Related Pages to 3?

- **Cost control**: Fewer pages = fewer tokens sent to AI
- **Focus**: Forces prioritization of most relevant relationships
- **Performance**: Less data to load and process

### Why Auto-Timestamps?

- **Convenience**: One less thing to remember
- **Consistency**: Always use ISO date format
- **Tracking**: Can see when pages were last touched

## Future Enhancements

- Full YAML parsing for complex metadata
- Validation of page relationships (check if related pages exist)
- Caching for frequently accessed pages
- Watch mode for file changes
- Backup/restore functionality
