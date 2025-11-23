---
title: Semantic Cross-Referencing System
category: concept
sourceFile: add-see-also-sections.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Semantic Cross-Referencing System

## Purpose and Overview

The Semantic Cross-Referencing System automatically analyzes relationships between wiki pages to generate contextual "See Also" sections. It intelligently discovers connections through explicit metadata, category hierarchy, and content type patterns to enhance documentation navigation and discoverability.

## Key Functionality

**Multi-Dimensional Relationship Analysis**: The system evaluates pages across three relationship dimensions:
- Explicit links defined in YAML frontmatter metadata
- Category hierarchy based on directory structure (meta/, concepts/, components/, guides/)
- Content type mapping patterns to identify related topics

**Automated Cross-Reference Generation**: 
- Processes all wiki pages through the main `addSeeAlsoSections` orchestrator
- Uses `findRelatedPages` to identify relevant connections for each page
- Generates structured markdown sections with categorized relationship groups (context, implementation, related topics)
- Calculates proper relative path links between pages at different directory levels

**Intelligent Content Discovery**: The system creates contextual navigation by analyzing page metadata extracted from YAML frontmatter and leveraging the wiki's directory-based categorization structure to build comprehensive cross-reference networks.

## Relationships

- **Extends WikiManager**: Integrates with the core wiki management system for content analysis and page manipulation
- **Frontmatter Integration**: Relies on YAML frontmatter parsing to extract structured metadata for explicit relationship definitions
- **Directory Structure Dependency**: Leverages the established directory-based categorization (meta/, concepts/, components/, guides/) for automatic content type classification

## Usage Example

```javascript
const { addSeeAlsoSections } = require('./add-see-also-sections');

// Process all wiki pages to add cross-reference sections
addSeeAlsoSections();

// The system will automatically:
// - Parse frontmatter metadata from each page
// - Analyze relationships through multiple dimensions
// - Generate "See Also" sections with proper relative links
```

The system operates on wiki pages with frontmatter metadata and generates cross-reference sections based on discovered relationships between content.

## Testing

No automated tests found for this component.