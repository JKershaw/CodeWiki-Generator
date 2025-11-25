---
title: Cross-page link injection system
category: component
sourceFile: add-cross-links.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Cross-page Link Injection System

## Purpose and Overview

The cross-page link injection system is a standalone CLI utility that automatically processes all wiki pages to add cross-references between related content. This system enables bidirectional reference discovery in existing wikis without requiring manual intervention, transforming static wikis into interconnected knowledge graphs.

## Key Functionality

The system operates as a batch processing tool that:

- **Scans all wiki pages** to identify potential cross-reference opportunities
- **Automatically injects links** between related pages based on content analysis
- **Enables bidirectional discovery** by creating connections that work in both directions
- **Processes existing wikis** without requiring manual page-by-page editing
- **Integrates with the Processor module** to leverage existing wiki transformation capabilities

The core functionality is implemented through the `addCrossLinksToAllPages()` method, which handles large-scale wiki transformations as part of the processor-based batch operations pattern.

## Relationships

This component connects to other parts of the codebase through:

- **Processor Module**: Extends the Processor with the `addCrossLinksToAllPages()` method for batch operations
- **Wiki Pages**: Reads from and modifies existing wiki page content
- **CLI Interface**: Operates as a standalone command-line utility
- **Batch Processing Pattern**: Follows the established pattern for large-scale wiki transformations

The system establishes a reusable pattern where the Processor module can handle various types of wiki-wide operations through dedicated methods.

## Usage Example

```javascript
const Processor = require('./processor');

// Initialize processor and run cross-link injection
const processor = new Processor();
processor.addCrossLinksToAllPages();
```

Alternatively, as a CLI utility:
```bash
node add-cross-links.js
```

## Testing

No automated tests are currently available for this component. Testing would need to be implemented to verify cross-link detection accuracy and proper integration with the Processor module.