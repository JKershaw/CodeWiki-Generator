---
title: Multi-Dimensional Page Relationship Analysis
category: component
sourceFile: add-see-also-sections.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Multi-Dimensional Page Relationship Analysis

## Purpose and Overview

The Multi-Dimensional Page Relationship Analysis component automatically analyzes wiki pages to identify and create contextual cross-references between related documentation. It implements intelligent content discovery by evaluating page relationships across multiple dimensions including explicit metadata, category hierarchies, and content type patterns to enhance navigation and content discoverability.

## Key Functionality

The component processes all wiki pages through a comprehensive relationship analysis engine:

- **Multi-dimensional Analysis**: Evaluates pages through explicit links in frontmatter, category hierarchy positioning, and content type mapping patterns
- **Automated Cross-Reference Generation**: Creates structured "See Also" sections with categorized relationship groups (context, implementation, related topics)
- **Intelligent Path Resolution**: Computes correct relative paths between pages across different directory levels
- **Metadata Integration**: Leverages YAML frontmatter parsing to extract structured relationship data
- **Directory-based Categorization**: Utilizes organized directory structures (meta/, concepts/, components/, guides/) for content classification

The system orchestrates through the main `addSeeAlsoSections` function, which coordinates relationship discovery via `findRelatedPages`, section generation through `buildSeeAlsoSection`, and proper link formatting using `calculateRelativePath`.

## Relationships

- **Extends WikiManager**: Integrates with the core wiki management system for content analysis and page manipulation
- **Frontmatter Metadata System**: Depends on YAML frontmatter structure for explicit relationship definitions and page metadata
- **Directory-based Organization**: Leverages standardized wiki directory structure for automatic content categorization and relationship inference
- **Semantic Cross-Referencing System**: Implements the core algorithm for the broader semantic navigation framework

## Usage Example

```javascript
const { addSeeAlsoSections } = require('./add-see-also-sections');

// Process all wiki pages to add cross-reference sections
await addSeeAlsoSections();

// The system automatically:
// 1. Scans all pages for metadata and relationships
// 2. Analyzes category hierarchies and content types  
// 3. Generates "See Also" sections with relative links
// 4. Updates page content with structured cross-references
```

## Testing

No automated tests found. Manual testing should verify cross-reference accuracy, proper relative path generation, and metadata parsing functionality across different wiki directory structures.