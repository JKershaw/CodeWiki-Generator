---
title: Semantic page relationship detection
category: component
sourceFile: add-see-also-sections.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Semantic Page Relationship Detection

## Purpose and Overview

The semantic page relationship detection component automatically discovers and creates cross-references between related wiki pages. It analyzes page metadata, categories, and content relationships to generate Wikipedia-style "See Also" sections that enhance navigation and content discovery within documentation wikis.

## Key Functionality

This component implements automated wiki enhancement through several key mechanisms:

- **Frontmatter Analysis**: Parses YAML metadata from markdown files to extract categories, tags, and explicit relationships
- **Relationship Discovery**: Uses `findRelatedPages()` to identify semantically related content through category hierarchies and metadata patterns
- **Cross-Reference Generation**: Builds formatted "See Also" sections with categorized links using `buildSeeAlsoSection()`
- **Path Resolution**: Calculates correct relative paths for cross-directory wiki links via `calculateRelativePath()`
- **Automated Enhancement**: Orchestrates the entire process through `addSeeAlsoSections()` to systematically enhance all wiki pages

The system leverages category analysis and metadata heuristics to group related pages, creating a network of contextual navigation that mirrors Wikipedia's approach to content organization.

## Relationships

- **Uses WikiManager**: Integrates with the wiki infrastructure for page enumeration and content access
- **Extends Wiki Generation**: Complements existing wiki creation by adding automated navigation structure
- **Enhances User Experience**: Transforms static documentation into an interconnected knowledge base with discoverable relationships

## Usage Example

```javascript
const addSeeAlsoSections = require('./add-see-also-sections');

// Enhance all wiki pages with automated cross-references
await addSeeAlsoSections();
```

The function processes all pages in the wiki, analyzing their frontmatter metadata and generating appropriate "See Also" sections based on discovered relationships and category hierarchies.

## Testing

No automated tests are currently available for this component.