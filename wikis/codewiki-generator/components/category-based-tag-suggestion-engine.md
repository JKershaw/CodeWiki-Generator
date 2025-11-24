---
title: Category-based tag suggestion engine
category: component
sourceFile: add-breadcrumbs-and-tags.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Category-based Tag Suggestion Engine

## Purpose and Overview

The category-based tag suggestion engine automatically enhances wiki pages with intelligent tagging and breadcrumb navigation. It analyzes existing wiki content and file structure to add relevant metadata, making documentation more discoverable and navigable without manual intervention.

## Key Functionality

The engine operates through several coordinated functions:

- **Automated Discovery**: Recursively scans the wiki directory to find all markdown files using `getAllMarkdownFiles()`
- **Breadcrumb Generation**: Creates hierarchical navigation paths with `generateBreadcrumb()` based on file system structure
- **Intelligent Tagging**: Uses the `TAG_SUGGESTIONS` mapping to assign relevant tags based on detected categories and content analysis
- **Frontmatter Enhancement**: Updates YAML frontmatter through `enhanceFrontmatter()` to include tags, categories, and navigation metadata
- **Batch Processing**: The main `addBreadcrumbsAndTags()` function orchestrates the entire process across all wiki files

The system leverages predefined category mappings in `TAG_SUGGESTIONS` to ensure consistent and relevant tag assignment across the entire wiki.

## Relationships

This component integrates deeply with the existing wiki infrastructure:

- **File System Integration**: Works directly with the established wiki directory structure and markdown file organization
- **Frontmatter Compatibility**: Enhances existing YAML frontmatter format without breaking compatibility with wiki generation systems
- **Category System**: Builds upon category-based organization patterns used by other wiki tools in the codebase
- **Navigation Enhancement**: Complements the core wiki generation system by adding discoverability features that improve user experience

## Usage Example

```javascript
const { addBreadcrumbsAndTags } = require('./add-breadcrumbs-and-tags.js');

// Process all wiki files to add navigation and tags
addBreadcrumbsAndTags();
```

The function automatically processes all markdown files in the wiki directory, adding breadcrumbs and tags based on the predefined `TAG_SUGGESTIONS` mapping and file path analysis.

## Testing

No automated tests are currently available for this component. Testing would benefit from coverage of the tag suggestion logic, breadcrumb generation algorithms, and frontmatter enhancement functionality.