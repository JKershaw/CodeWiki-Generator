---
title: HTML-aware link enhancement
category: concept
sourceFile: enhance-wiki-linking.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# HTML-aware link enhancement

## Purpose and Overview

The HTML-aware link enhancement prevents automatic wiki link creation from interfering with existing HTML content in markdown files. It detects when potential wiki link targets are already embedded within HTML tags or elements and skips them during the automated linking process.

## Key Functionality

The core functionality revolves around HTML context detection:

- **HTML tag detection**: The `isInsideHtmlTag` function analyzes text positions to determine if they fall within HTML markup
- **Link creation filtering**: Integrates with the existing link discovery system to exclude mentions that are already part of HTML elements
- **Content preservation**: Ensures that existing HTML structure remains intact while still enabling wiki links in plain markdown text

This enhancement extends the existing `isAlreadyLinked` function by adding HTML awareness, creating a more robust system that can handle mixed markdown and HTML content.

## Relationships

This component integrates with several parts of the wiki linking system:

- **Extends**: The existing `isAlreadyLinked` function with HTML detection capabilities
- **Collaborates with**: `linkDiscovery.findMentions` to filter out HTML-embedded mentions before link creation
- **Part of**: The broader bidirectional wiki linking enhancement system

The HTML detection acts as a filter in the link creation pipeline, preventing modifications to content that is already structured as HTML.

## Usage Example

```javascript
const enhance = require('./enhance-wiki-linking');

// Check if a position in text is inside HTML tags
const text = "Here is some <a href='#'>existing link</a> content";
const position = 25; // Position within the existing link
const isInHtml = isInsideHtmlTag(text, position);
// Returns true, preventing wiki link creation at this position
```

## Testing

No automated tests are currently available for this component. The functionality relies on integration with the broader wiki linking system and would benefit from test coverage for HTML detection scenarios.