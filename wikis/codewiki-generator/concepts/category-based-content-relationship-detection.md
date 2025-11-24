---
title: Category-Based Content Relationship Detection
category: concept
sourceFile: add-see-also-sections.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Category-Based Content Relationship Detection

## Purpose and Overview

Category-Based Content Relationship Detection automatically analyzes wiki pages to identify semantic relationships and generate "See Also" sections with relevant cross-references. This system uses directory structure, frontmatter metadata, and explicit links to create Wikipedia-style content discovery, helping users navigate related documentation across different categories like concepts, guides, and meta pages.

## Key Functionality

The component provides several core functions for intelligent content linking:

- **`addSeeAlsoSections`** - Main orchestrator that processes all wiki pages and adds See Also sections with related content links
- **`findRelatedPages`** - Implements semantic relationship detection using explicit metadata, category hierarchy, and content type analysis
- **`buildSeeAlsoSection`** - Generates structured markdown for See Also sections with categorized links (Context, Implementation, Related Topics)
- **`calculateRelativePath`** - Computes correct relative paths between wiki pages in different directory levels
- **`parseFrontmatter`** - Extracts YAML frontmatter metadata from markdown files for relationship analysis

The system analyzes content relationships through multiple methods:
- Explicit `related` fields in YAML frontmatter
- Directory-based categorization (meta, concepts, guides, etc.)
- Cross-references between different content types
- Hierarchical category analysis

## Relationships

This component extends the WikiManager functionality and integrates deeply with the existing wiki infrastructure:

- **Extends WikiManager** - Builds on core wiki page processing capabilities
- **Works with frontmatter metadata** - Leverages existing YAML structure for relationship data
- **Integrates with directory organization** - Uses established wiki folder patterns for categorization

## Usage Example

```javascript
const { addSeeAlsoSections } = require('./add-see-also-sections');

// Process all wiki pages and add See Also sections
addSeeAlsoSections();

// The system will automatically:
// 1. Parse frontmatter from all markdown files
// 2. Detect relationships based on categories and metadata
// 3. Generate See Also sections with relative links
// 4. Update files with structured cross-references
```

The component expects wiki pages to have frontmatter with optional `related` fields:

```yaml
---
title: "My Concept"
related: ["other-concept", "related-guide"]
---
```

## Testing

No automated tests found - manual verification required for cross-reference accuracy and link generation.