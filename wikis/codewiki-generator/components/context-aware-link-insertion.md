---
title: Context-aware link insertion
category: component
sourceFile: enhance-wiki-linking.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Context-aware link insertion

## Purpose and Overview

The context-aware link insertion component automatically creates cross-references between wiki pages by intelligently identifying mentions of page titles within markdown content. It implements Wikipedia-style bidirectional linking that transforms isolated markdown files into a connected knowledge graph while preserving existing formatting and avoiding duplicate links.

## Key Functionality

This component provides sophisticated logic for enhancing wiki content with automatic cross-links:

- **Intelligent mention detection**: Uses `LinkDiscoveryAgent` to scan markdown content and identify references to other wiki pages based on their titles
- **Duplicate link prevention**: The `isAlreadyLinked` function checks if text positions are already part of existing markdown links to avoid creating redundant references  
- **Format preservation**: `createMarkdownLink` generates proper relative markdown links while maintaining original text formatting like bold or italic styling
- **Context-aware insertion**: Analyzes surrounding content to determine appropriate placement of new cross-references without disrupting document structure

The main `enhanceBidirectionalLinks` function orchestrates the entire process across all wiki pages, creating a comprehensive network of interconnected content.

## Relationships

This component integrates deeply with the existing wiki infrastructure:

- **Depends on WikiManager**: Accesses page content, metadata, and file structure for processing
- **Uses LinkDiscoveryAgent**: Leverages specialized logic for finding potential cross-reference opportunities
- **Integrates with frontmatter structure**: Works within the established wiki page format and metadata system
- **Complements wiki generation**: Functions as a post-processing enhancement step after initial wiki creation

## Usage Example

```javascript
const { enhanceBidirectionalLinks } = require('./enhance-wiki-linking');

// Process all wiki pages to add automatic cross-links
await enhanceBidirectionalLinks(wikiManager);

// The function modifies wiki pages in-place, adding cross-references
// where page titles are mentioned in content
```

## Testing

No automated tests are currently available for this component. Manual testing should verify that cross-links are properly inserted without breaking existing markdown formatting or creating duplicate references.