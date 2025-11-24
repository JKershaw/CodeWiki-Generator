---
title: Content-based TOC generation
category: component
sourceFile: add-table-of-contents.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Content-based TOC Generation

## Purpose and Overview

The Content-based TOC generation component automatically analyzes markdown files in the wiki and intelligently adds table of contents sections where they would improve navigation. It processes documents based on content complexity heuristics, ensuring TOCs are only added when they provide genuine value to readers.

## Key Functionality

The system performs automated markdown enhancement through several key operations:

- **File Discovery**: Recursively scans the wiki directory structure to locate all markdown files for processing
- **Content Analysis**: Extracts headings from markdown content and evaluates document complexity using configurable thresholds
- **Intelligent TOC Generation**: Creates hierarchically indented table of contents with clean anchor links when documents meet minimum criteria
- **Conditional Enhancement**: Only adds TOCs to documents that have sufficient headings (`MIN_HEADINGS_FOR_TOC`) or content length (`MIN_CONTENT_LENGTH`)
- **Anchor Creation**: Generates URL-friendly anchor links from heading text for proper navigation

The component uses two primary thresholds to determine when a TOC adds value: a minimum number of headings and a minimum content length, ensuring smaller or simple documents aren't cluttered with unnecessary navigation.

## Relationships

This component integrates with the broader wiki enhancement pipeline and follows established patterns used by other documentation tools in the system. It processes files from the same wiki structure and uses consistent frontmatter parsing patterns found in other markdown processing components. The tool fits into the automated documentation enhancement system architecture, which can be extended with additional content improvement scripts.

## Usage Example

```javascript
const { addTableOfContents } = require('./add-table-of-contents');

// Process all markdown files and add TOCs where appropriate
addTableOfContents();

// The system will automatically:
// - Find all .md files in the wiki
// - Analyze content complexity
// - Generate and insert TOCs for qualifying documents
```

## Testing

No automated tests are currently available for this component.