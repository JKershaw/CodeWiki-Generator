---
title: Content format normalization
category: component
sourceFile: lib/agents/wiki-index-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Content Format Normalization

## Purpose and Overview

Content format normalization provides a standardized approach for converting mixed HTML and markdown content into clean, consistent markdown format. This component ensures that wiki content from various sources can be processed uniformly through the WikiIndexAgent pipeline.

## Key Functionality

The normalization process centers around the `_convertHtmlToMarkdown` function, which performs comprehensive HTML-to-markdown conversion including:

- **Headings**: Converts `<h1>` through `<h6>` tags to markdown heading syntax
- **Links**: Transforms HTML anchor tags to markdown link format `[text](url)`
- **Lists**: Handles both ordered (`<ol>`) and unordered (`<ul>`) lists with proper nesting
- **Code blocks**: Preserves `<code>` and `<pre>` elements as markdown code syntax
- **Text formatting**: Converts `<strong>`, `<em>`, and other formatting tags
- **HTML entities**: Decodes common HTML entities like `&amp;`, `&lt;`, `&gt;`
- **Whitespace**: Normalizes spacing and removes excessive line breaks

The conversion process maintains content structure while ensuring compatibility with downstream markdown processors.

## Relationships

- **Extends WikiIndexAgent**: Integrates as part of the content cleaning pipeline within the wiki indexing system
- **Complements _cleanContent**: Works alongside existing content cleaning methods to provide comprehensive format normalization
- **Supports content processing**: Enables consistent handling of content from different sources (HTML files, markdown files, mixed formats)

## Usage Example

```javascript
const WikiIndexAgent = require('./lib/agents/wiki-index-agent');

const agent = new WikiIndexAgent();
const htmlContent = '<h2>Example</h2><p>Content with <strong>formatting</strong></p>';
const normalizedContent = agent._convertHtmlToMarkdown(htmlContent);
// Returns: "## Example\n\nContent with **formatting**"
```

## Testing

No automated tests are currently available for this component. Testing should focus on validating HTML-to-markdown conversion accuracy across different HTML structures and edge cases.