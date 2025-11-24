---
title: Markdown processing pipeline
category: component
sourceFile: add-table-of-contents.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Add Table of Contents

## Purpose and Overview

Automatically enhances markdown documentation by adding table of contents sections based on content complexity. This intelligent processor analyzes document structure and only adds navigation aids when the content justifies it, using heuristics like heading count and content length to make enhancement decisions.

## Key Functionality

The component implements a complete markdown processing pipeline that:

- **Discovers Content**: Recursively finds all markdown files in the wiki directory structure
- **Analyzes Complexity**: Evaluates documents using configurable thresholds (`MIN_HEADINGS_FOR_TOC` and `MIN_CONTENT_LENGTH`) to determine if a table of contents would be beneficial
- **Extracts Structure**: Parses markdown to identify headings and generates URL-safe anchor links
- **Generates TOC**: Creates hierarchical table of contents with proper indentation that reflects document structure
- **Preserves Format**: Maintains existing frontmatter and document formatting while safely inserting enhancements

The processing pipeline handles frontmatter parsing, heading extraction with anchor generation, and markdown reconstruction to ensure documents remain properly formatted.

## Relationships

- Operates on existing wiki directory structures without requiring changes to file organization
- Processes markdown files that follow frontmatter conventions
- Functions as part of broader wiki enhancement automation workflows
- Works alongside other markdown processing tools in the documentation pipeline

## Usage Example

```javascript
const { addTableOfContents } = require('./add-table-of-contents');

// Process all markdown files in the wiki directory
// Automatically adds TOCs to documents meeting complexity thresholds
await addTableOfContents();
```

The function processes files autonomously, using the configured `MIN_HEADINGS_FOR_TOC` and `MIN_CONTENT_LENGTH` constants to determine which documents receive table of contents enhancements.

## Testing

No automated tests found for this component.