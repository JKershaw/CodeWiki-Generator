---
title: Markdown link normalization
category: component
sourceFile: lib/agents/wiki-index-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Markdown Link Normalization

## Purpose and Overview

The markdown link normalization component implements defensive parsing to handle malformed HTML-to-markdown conversion where links may already contain markdown syntax. It prevents double-encoding and broken link structures that can occur during wiki document processing.

## Key Functionality

This component provides three main normalization functions:

- **HTML link regex with markdown extraction**: Uses pattern matching to extract URLs from markdown syntax that may be embedded within HTML href attributes
- **Double extension cleanup**: Removes duplicate `.md.md` extensions that commonly occur during iterative link processing
- **Text content markdown cleanup**: Strips markdown link syntax from link text content to prevent nested markdown structures like `[text [link](url) more text](outer-url)`

The normalization process handles edge cases where HTML-to-markdown converters encounter links that have already been partially processed or contain mixed formatting.

## Relationships

This component integrates with:

- **WikiIndexAgent HTML-to-markdown conversion pipeline**: Serves as a preprocessing step to clean malformed links before final markdown generation
- **Wiki document link processing**: Ensures consistent link formatting across wiki pages during indexing operations

## Usage Example

```javascript
// Pattern for extracting URLs from markdown syntax in HTML attributes
const htmlLinkRegex = /<a\s+href="([^"]*\[.*?\]\(([^)]+)\)[^"]*)"[^>]*>/g;

// Clean up double extensions
const cleanedUrl = url.replace(/\.md\.md$/, '.md');

// Remove markdown syntax from link text content
const cleanText = linkText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
```

## Testing

No automated tests are currently available for this component. Manual testing should verify proper handling of malformed HTML links containing markdown syntax and prevention of double-encoding scenarios.