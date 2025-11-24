---
title: Wikipedia-style bidirectional linking
category: concept
sourceFile: enhance-wiki-linking.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Wikipedia-style bidirectional linking

## Purpose and Overview

Implements automatic cross-referencing between wiki pages to enhance discoverability and navigation, mimicking Wikipedia's interconnected knowledge structure. This system processes markdown content to automatically detect mentions of other pages and creates bidirectional links between them.

## Key Functionality

The bidirectional linking system provides intelligent automatic cross-linking capabilities:

- **Automatic Link Discovery**: Uses the `LinkDiscoveryAgent` to scan markdown content and identify potential mentions of other wiki pages
- **Smart Link Creation**: Generates properly formatted relative markdown links while preserving existing content structure
- **Duplicate Prevention**: The `isAlreadyLinked` function ensures text positions aren't linked multiple times, avoiding conflicts with existing markdown links
- **Path Resolution**: Creates accurate relative links between pages regardless of their location in the wiki hierarchy
- **Content Preservation**: Maintains original formatting and frontmatter structure while enhancing connectivity

The main `enhanceBidirectionalLinks` function orchestrates the entire process, working with the WikiManager to discover pages and systematically enhance cross-references throughout the wiki.

## Relationships

- **WikiManager Integration**: Relies on WikiManager for page discovery and content management operations
- **Agent Architecture**: Uses the `LinkDiscoveryAgent` as part of the broader agent-based system pattern
- **Markdown Processing**: Works with frontmatter-structured markdown files, preserving their format while adding enhancements
- **File System Operations**: Integrates with the codebase's file management utilities for reading and writing wiki content

## Usage Example

```javascript
const { enhanceBidirectionalLinks } = require('./enhance-wiki-linking.js');

// Process all wiki pages to add automatic cross-links
enhanceBidirectionalLinks();
```

The system automatically discovers existing wiki pages, analyzes their content for mentions of other pages, and updates the files with appropriate markdown links while preserving existing formatting and links.

## Testing

No automated tests found for this component.