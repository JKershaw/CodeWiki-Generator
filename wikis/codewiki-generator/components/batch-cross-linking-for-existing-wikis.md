---
title: Batch cross-linking for existing wikis
category: component
sourceFile: add-cross-links.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Batch Cross-linking for Existing Wikis

## Purpose and Overview

`add-cross-links.js` is a standalone utility that retroactively enriches existing wiki documentation by automatically adding cross-page links to related content. This enables incremental enhancement of wikis that were created without cross-linking, eliminating the need to regenerate entire documentation sets.

## Key Functionality

This component provides a CLI-based entry point for batch cross-linking operations:

- **main()** - Orchestrates the cross-linking process, handling execution flow and user feedback with structured error handling for CLI environments
- **addCrossLinksToAllPages()** - Processor method that iterates through all pages in the wiki, loads full page content, and systematically adds cross-page links to existing content based on detected page references

The utility leverages the Processor class to manipulate wiki pages, enabling automated enrichment without manual intervention across multiple pages.

## Relationships

- **Depends on**: `Processor` class from `./lib/processor` for wiki structure manipulation and page operations
- **Integrates with**: Existing wiki structure located at `./wiki`
- **Operates on**: Full page content loaded by the Processor's `addCrossLinksToAllPages()` method

## Usage Example

```javascript
const Processor = require('./lib/processor');

const processor = new Processor('./wiki');
processor.addCrossLinksToAllPages()
  .then(() => {
    console.log('Cross-linking completed successfully');
  })
  .catch((error) => {
    console.error('Cross-linking failed:', error.message);
    process.exit(1);
  });
```

To run this as a CLI command:

```bash
node add-cross-links.js
```

## Testing

No automated tests are currently available for this component. Users should manually verify that cross-links are correctly added to wiki pages and that existing content remains intact after execution.