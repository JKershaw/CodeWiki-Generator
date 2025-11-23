---
title: HTML to Markdown conversion system
category: component
sourceFile: lib/agents/wiki-index-agent.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# HTML to Markdown Conversion System

## Purpose and Overview

The HTML to Markdown conversion system is a content normalization component within the WikiIndexAgent that converts HTML tags to equivalent Markdown syntax. This system enables consistent processing and display of mixed HTML/Markdown content by standardizing all content to Markdown format.

## Key Functionality

The `_convertHtmlToMarkdown` function handles comprehensive HTML-to-Markdown conversion including:

- **Headings**: Converts `<h1>` through `<h6>` tags to Markdown header syntax (`#`, `##`, etc.)
- **Text formatting**: Transforms `<strong>`, `<b>`, `<em>`, and `<i>` tags to `**bold**` and `*italic*` syntax
- **Links**: Converts `<a href="">` elements to `[text](url)` format
- **Lists**: Handles both ordered (`<ol>`) and unordered (`<ul>`) lists with proper nesting
- **Code blocks**: Preserves `<pre>` and `<code>` elements as Markdown code syntax
- **HTML entities**: Decodes common entities like `&amp;`, `&lt;`, `&gt;`, and `&quot;`
- **Content cleanup**: Removes or normalizes various HTML artifacts

## Relationships

- **Integrates with WikiIndexAgent**: Functions as part of the `_cleanContent` method's content processing pipeline
- **Supports wiki-context CLI**: Provides content normalization capabilities for the command-line tool's processing requirements
- **Content processing chain**: Works alongside other content cleaning and normalization functions to ensure consistent output format

## Usage Example

```javascript
const WikiIndexAgent = require('./lib/agents/wiki-index-agent');

const agent = new WikiIndexAgent(options);
// HTML content gets automatically converted during content processing
const processedContent = agent._cleanContent(htmlContent);
// The _convertHtmlToMarkdown method is called internally as part of cleaning
```

*Note: The `_convertHtmlToMarkdown` method is internal to the WikiIndexAgent and is typically called as part of the content cleaning pipeline rather than directly.*

## Testing

No automated tests are currently available for this component. Testing would benefit from coverage of various HTML input scenarios and verification of proper Markdown output formatting.