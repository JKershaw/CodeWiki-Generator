---
title: Category-based content classification
category: component
sourceFile: add-breadcrumbs-and-tags.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Category-based content classification

## Purpose and Overview

The category-based content classification component automatically categorizes and tags wiki content based on file path structure and title analysis. It enables systematic content organization by intelligently assigning metadata tags and categories to markdown files, making wiki pages more discoverable and navigable through Wikipedia-style breadcrumb navigation.

## Key Functionality

This component provides automated metadata enhancement for wiki documentation:

- **Hierarchical breadcrumb generation**: Creates navigation breadcrumbs from file path structure to show page location within the wiki hierarchy
- **Intelligent content tagging**: Automatically assigns relevant tags based on predefined category mappings and content analysis
- **Frontmatter enhancement**: Enriches existing markdown frontmatter with categories, tags, and layer information
- **Bulk processing**: Recursively processes all markdown files in the wiki directory structure
- **Category-based suggestions**: Uses the `TAG_SUGGESTIONS` mapping to provide context-appropriate tags for different content types

The system analyzes file paths and titles to determine appropriate categories, then applies corresponding tag suggestions to improve content discoverability and organization.

## Relationships

This component integrates with the broader wiki generation ecosystem:

- **Wiki structure dependency**: Operates on the same directory structure used by other documentation tools
- **Frontmatter compatibility**: Enhances the standardized frontmatter format used across wiki processing scripts
- **Pipeline integration**: Functions as part of the wiki generation and enhancement pipeline alongside other metadata processors

## Usage Example

```javascript
const { addBreadcrumbsAndTags } = require('./add-breadcrumbs-and-tags.js');

// Process all markdown files to add navigation and metadata
await addBreadcrumbsAndTags();

// The function automatically:
// - Finds all .md files in the wiki directory
// - Generates breadcrumbs from file paths
// - Adds relevant tags based on content categories
// - Updates frontmatter with enhanced metadata
```

The component processes files in-place, updating their frontmatter with generated breadcrumbs, categories, and suggested tags based on the file's location and content type.

## Testing

No automated tests are currently available for this component.