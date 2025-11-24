---
title: Content-aware link enhancement
category: concept
sourceFile: enhance-wiki-linking.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Content-aware Link Enhancement

## Purpose and Overview

Content-aware link enhancement provides intelligent filtering for automated wiki link placement by analyzing content context to prevent corruption of HTML structures. This system ensures that markdown links are only inserted in appropriate text contexts, avoiding interference with existing HTML tags and block elements.

## Key Functionality

The enhancement system works by:

- **HTML Context Detection**: Uses the `isInsideHtmlTag` function to analyze text positions and determine if they fall within HTML tag boundaries or block elements
- **Safe Link Placement**: Prevents automatic link insertion when text is already part of HTML markup, preserving document structure integrity
- **Content-Aware Filtering**: Extends existing link detection with HTML-aware logic to handle mixed markdown and HTML content

The core mechanism examines the surrounding context of potential link targets before allowing link insertion, ensuring that HTML attributes, tag names, and other markup elements remain untouched during the automated linking process.

## Relationships

This component integrates with several parts of the wiki linking system:

- **Extends** the existing `isAlreadyLinked` function by adding HTML-aware filtering capabilities
- **Integrates** with the linkDiscovery mention filtering pipeline to provide content context validation
- **Supports** the bidirectional wiki linking system by ensuring reliable link placement in both directions

## Usage Example

```javascript
const { isInsideHtmlTag } = require('./enhance-wiki-linking');

// Check if position is safe for link insertion
const content = '<div class="example">Some text here</div>';
const position = 15; // Position within "example"
const isSafe = !isInsideHtmlTag(content, position);

if (isSafe) {
    // Proceed with link insertion
} else {
    // Skip link insertion to preserve HTML structure
}
```

## Testing

No automated tests are currently available for this component. Testing should focus on verifying HTML context detection accuracy and ensuring link placement does not corrupt various HTML structures and markdown combinations.