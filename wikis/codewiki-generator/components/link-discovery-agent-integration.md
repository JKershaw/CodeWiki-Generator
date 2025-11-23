---
title: Link discovery agent integration
category: component
sourceFile: enhance-wiki-linking.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Link Discovery Agent Integration

## Purpose and Overview

The link discovery agent integration automatically creates bidirectional cross-links between wiki pages by analyzing content for mentions of other pages. This system enables Wikipedia-style navigation without requiring manual link management, creating an interconnected knowledge base that spans meta documentation, code references, and historical content.

## Key Functionality

The integration processes all wiki pages through three main functions:

- **enhanceBidirectionalLinks**: The main orchestrator that scans wiki content, identifies potential page mentions using the LinkDiscoveryAgent, and automatically inserts markdown links between related pages
- **isAlreadyLinked**: Prevents duplicate linking by checking if text is already part of an existing markdown link structure
- **createMarkdownLink**: Generates properly formatted relative markdown links with correct path resolution while preserving existing text formatting like bold or italic

The system works by parsing frontmatter-structured markdown files, analyzing their content for references to other wiki pages, and intelligently inserting cross-references that maintain the document's readability and structure.

## Relationships

This component integrates deeply with the existing wiki infrastructure:

- **WikiManager dependency**: Relies on WikiManager for page discovery, content access, and file system operations
- **LinkDiscoveryAgent integration**: Leverages the agent's intelligent mention detection to identify potential cross-references
- **Wiki system extension**: Enhances the base wiki functionality with automated relationship mapping
- **Markdown processing**: Works within the frontmatter-based markdown structure used throughout the wiki

## Usage Example

```javascript
const { enhanceBidirectionalLinks } = require('./enhance-wiki-linking.js');

// Process all wiki pages to add automatic cross-links
await enhanceBidirectionalLinks();
```

The function processes the entire wiki content automatically, requiring no additional configuration. It discovers existing pages, analyzes their content for mentions of other pages, and updates the markdown files with appropriate cross-links while preserving the original formatting and structure.

## Testing

No automated tests are currently available for this component. Manual testing involves running the enhancement process and verifying that appropriate cross-links are created without duplicating existing links or breaking document formatting.