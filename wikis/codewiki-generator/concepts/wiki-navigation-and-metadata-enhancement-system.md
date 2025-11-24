---
title: Wiki navigation and metadata enhancement system
category: concept
sourceFile: add-breadcrumbs-and-tags.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Wiki Navigation and Metadata Enhancement System

## Purpose and Overview

The wiki navigation and metadata enhancement system automatically adds breadcrumb navigation and intelligent tagging to markdown files in a wiki structure. It processes file paths and content to create Wikipedia-style navigation elements and categorizes content based on directory structure and title analysis.

## Key Functionality

**Breadcrumb Generation**: Creates hierarchical navigation paths based on file directory structure, enabling users to understand their location within the wiki and navigate to parent sections.

**Intelligent Tagging**: Automatically enhances frontmatter with relevant tags, categories, and classification layers by analyzing file paths and titles against predefined category mappings defined in `TAG_SUGGESTIONS`.

**Batch Processing**: Recursively discovers and processes all markdown files in the wiki directory structure through `getAllMarkdownFiles`, ensuring consistent navigation and metadata across the entire wiki.

**Frontmatter Enhancement**: The `enhanceFrontmatter` function intelligently adds metadata without overwriting existing frontmatter, preserving manual customizations while filling in missing navigation and categorization data.

## Relationships

This system operates on the same wiki directory structure used by other documentation tools in the codebase. It enhances the frontmatter format that other wiki processing scripts expect, making it a foundational component in the broader wiki generation pipeline. The breadcrumbs and tags it generates improve discoverability for wiki search and navigation systems.

## Usage Example

```javascript
const { addBreadcrumbsAndTags } = require('./add-breadcrumbs-and-tags.js');

// Process all markdown files in the wiki directory
await addBreadcrumbsAndTags();

// The system will automatically:
// - Find all .md files recursively
// - Generate breadcrumbs based on file paths
// - Add relevant tags and categories to frontmatter
// - Enhance navigation metadata across the wiki
```

## Testing

No automated tests are currently available for this component. Testing should focus on verifying breadcrumb generation accuracy, tag suggestion correctness, and frontmatter preservation during enhancement operations.