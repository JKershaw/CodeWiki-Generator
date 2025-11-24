---
title: Semantic Wiki Cross-Referencing System
category: concept
sourceFile: add-see-also-sections.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Semantic Wiki Cross-Referencing System

## Purpose and Overview

The Semantic Wiki Cross-Referencing System automatically generates "See Also" sections for wiki pages by analyzing relationships between content based on categories, metadata, and explicit links. This creates Wikipedia-style cross-references that help users discover related documentation across different sections of the codebase wiki.

## Key Functionality

The system implements intelligent content discovery through several key mechanisms:

- **Category-Based Relationship Detection**: Uses directory structure and frontmatter metadata to identify related content across documentation categories (meta, concepts, guides, etc.)
- **Semantic Link Generation**: Analyzes explicit metadata relationships and content types to create contextually relevant cross-references
- **Structured Section Building**: Generates organized "See Also" sections with categorized links (Context, Implementation, Related Topics)
- **Relative Path Management**: Calculates correct relative paths between wiki pages at different directory levels
- **Frontmatter Integration**: Extracts and processes YAML frontmatter metadata for relationship analysis

The main workflow processes all wiki pages, identifies related content through multiple detection strategies, and injects formatted "See Also" sections into the markdown files.

## Relationships

- **Extends WikiManager**: Builds upon existing wiki management functionality to add cross-page analysis capabilities
- **Frontmatter Integration**: Works with the established frontmatter metadata structure, particularly `related` fields
- **Directory Organization**: Integrates with the wiki's directory organization pattern to understand content categories and hierarchy

## Usage Example

```javascript
const { addSeeAlsoSections } = require('./add-see-also-sections');

// Process all wiki pages and add See Also sections
await addSeeAlsoSections();

// The system will automatically:
// - Scan all markdown files in the wiki
// - Analyze relationships via frontmatter and categories
// - Generate and inject See Also sections
```

To control relationship detection, structure your frontmatter metadata:

```yaml
---
title: "Component Documentation"
category: "concepts"
related:
  - "implementation-guide.md"
  - "api-reference.md"
---
```

## Testing

No automated tests are currently available for this component.