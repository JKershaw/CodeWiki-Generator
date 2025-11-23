---
title: Category-based content classification
category: concept
sourceFile: add-breadcrumbs-and-tags.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Category-based Content Classification

## Purpose and Overview

This system provides automated content classification and navigation enhancement for wiki documentation. It analyzes markdown files to generate hierarchical breadcrumbs and applies category-based tags, making documentation more discoverable and navigable through structured metadata.

## Key Functionality

The classification system operates through several coordinated functions:

- **Content Discovery**: Recursively scans the wiki directory structure to identify all markdown files for processing
- **Breadcrumb Generation**: Creates hierarchical navigation paths based on file location within the directory structure
- **Automated Tagging**: Analyzes content and applies relevant tags from predefined category mappings stored in `TAG_SUGGESTIONS`
- **Frontmatter Enhancement**: Enriches YAML frontmatter with structured metadata including categories, layers, and classification tags
- **Batch Processing**: Orchestrates the entire enhancement workflow across all discovered markdown files

The system uses directory structure as a primary signal for categorization, supplemented by content analysis to ensure accurate classification and tagging.

## Relationships

This component integrates deeply with the existing wiki infrastructure:

- **File System Integration**: Operates directly on the wiki's directory structure and markdown files
- **Frontmatter Dependency**: Requires and enhances YAML frontmatter blocks in markdown files
- **Navigation System**: Provides foundational data for wiki navigation components through generated breadcrumbs
- **Content Management**: Supports content discovery and organization through the category/layer/tag metadata schema

## Usage Example

```javascript
const { addBreadcrumbsAndTags } = require('./add-breadcrumbs-and-tags');

// Process all markdown files in the wiki
addBreadcrumbsAndTags();

// The system will automatically:
// - Discover all .md files
// - Generate breadcrumbs based on file paths
// - Add relevant tags and categories to frontmatter
// - Enhance navigation metadata
```

The processing modifies markdown files in-place, adding or updating frontmatter with navigation and classification data. Files are enhanced with breadcrumb navigation, category assignments, and relevant tags based on their location and content analysis.

## Testing

No automated tests are currently available for this component.