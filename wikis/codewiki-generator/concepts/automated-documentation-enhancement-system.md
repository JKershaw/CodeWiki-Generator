---
title: Automated documentation enhancement system
category: concept
sourceFile: add-table-of-contents.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Automated Documentation Enhancement System

## Purpose and Overview

The automated documentation enhancement system intelligently analyzes markdown files in a wiki and adds table of contents (TOC) sections where they would improve readability. It automatically processes all markdown files in the wiki directory structure and inserts TOCs based on content complexity and structure.

## Key Functionality

The system provides intelligent TOC generation with the following capabilities:

- **Recursive file discovery**: Scans the entire wiki directory structure to find all markdown files
- **Smart TOC insertion**: Only adds TOCs when content meets minimum thresholds for complexity (configurable via `MIN_HEADINGS_FOR_TOC` and `MIN_CONTENT_LENGTH` constants)
- **Heading extraction**: Parses markdown content to identify all heading levels and generates clean anchor links
- **Hierarchical formatting**: Creates properly indented TOC structure that reflects the document's heading hierarchy
- **Frontmatter preservation**: Maintains existing frontmatter while inserting TOCs appropriately

The system uses content-based heuristics to determine when a TOC would be beneficial, avoiding cluttering simple documents with unnecessary navigation elements.

## Relationships

This component integrates with the broader wiki enhancement pipeline and follows established patterns:

- Uses the same markdown file discovery and processing patterns as other documentation tools in the codebase
- Follows consistent frontmatter parsing patterns used throughout the wiki system
- Designed to work alongside other automated documentation improvement tools

## Usage Example

```javascript
const { addTableOfContents } = require('./add-table-of-contents');

// Process all markdown files and add TOCs where appropriate
addTableOfContents();
```

The system automatically:
1. Discovers all `.md` files in the wiki directory
2. Analyzes each file's content and structure
3. Generates and inserts TOCs for files meeting the complexity thresholds
4. Preserves existing formatting and frontmatter

## Testing

No automated tests are currently available for this component.