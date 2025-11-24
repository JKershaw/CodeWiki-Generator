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

The markdown link normalization component provides robust HTML-to-Markdown link conversion with defensive parsing capabilities. It handles edge cases where HTML anchor tags contain nested markdown syntax, preventing double-encoding and malformed link structures during wiki document processing.

## Key Functionality

This component implements several normalization strategies to clean up problematic link conversions:

- **HTML link regex handling**: Extracts and sanitizes href URLs from HTML anchor tags, with special handling for markdown syntax embedded within href attributes
- **Double extension cleanup**: Removes duplicate `.md.md` extensions that occur during iterative link processing workflows
- **Nested markdown prevention**: Strips existing markdown link syntax from link text content to prevent invalid nested structures like `[text [link](url) more text](outer-url)`
- **Malformed href attribute processing**: Handles cases where HTML-to-markdown converters encounter links that have already been partially processed or contain mixed formatting

The normalization uses pattern matching to identify and extract clean URLs from complex markup scenarios, ensuring consistent markdown output regardless of input quality.

## Relationships

This component integrates as part of the WikiIndexAgent's content processing pipeline:

- **WikiIndexAgent HTML-to-Markdown conversion**: Serves as a preprocessing step within the larger document transformation workflow
- **Wiki content indexing**: Ensures link consistency across wiki pages during index generation and content processing operations

## Usage Example

```javascript
// HTML link pattern matching for markdown extraction
const htmlLinkRegex = /<a\s+href="([^"]*\[.*?\]\(([^)]+)\)[^"]*)"[^>]*>/g;

// Process HTML content with embedded markdown links
const processedContent = htmlContent.replace(htmlLinkRegex, (match, href, extractedUrl) => {
  // Clean double extensions and normalize URL
  const cleanUrl = extractedUrl.replace(/\.md\.md$/, '.md');
  return `[${linkText}](${cleanUrl})`;
});
```

## Testing

No automated tests are currently available for this component. Testing should focus on verifying proper handling of malformed HTML links containing markdown syntax and prevention of double-encoding scenarios during wiki content processing.