---
title: Bidirectional wiki linking system
category: concept
sourceFile: enhance-wiki-linking.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Bidirectional Wiki Linking System

## Purpose and Overview

The bidirectional wiki linking system automatically creates cross-references between wiki pages by analyzing content and identifying mentions of other pages. This Wikipedia-style linking system enables intelligent discovery of related content across different wiki layers (meta, code, and history) without requiring manual link management.

## Key Functionality

The system processes all wiki pages to add automatic cross-links based on content analysis:

- **Intelligent Link Discovery**: Integrates with the LinkDiscoveryAgent to automatically find potential page mentions within content
- **Duplicate Prevention**: Uses `isAlreadyLinked()` to prevent creating links in text that's already part of existing markdown links
- **Relative Path Resolution**: Generates proper relative markdown links with `createMarkdownLink()` while preserving text formatting like bold
- **Frontmatter Processing**: Works with frontmatter-structured markdown files from the existing wiki system

The main `enhanceBidirectionalLinks()` function orchestrates the entire process, analyzing each page's content and injecting appropriate cross-links where relevant mentions are detected.

## Relationships

- **Depends on WikiManager**: Uses WikiManager for page management and content access
- **Integrates with LinkDiscoveryAgent**: Leverages the agent for intelligent mention detection capabilities
- **Extends Wiki System**: Builds upon the existing wiki infrastructure to add automated cross-referencing
- **Processes Markdown Files**: Works with the standard frontmatter-structured markdown files used throughout the wiki

## Usage Example

```javascript
const { enhanceBidirectionalLinks } = require('./enhance-wiki-linking');
const WikiManager = require('./wiki-manager');

// Initialize wiki manager and run enhancement
const wikiManager = new WikiManager();
await enhanceBidirectionalLinks(wikiManager);
```

The enhancement process analyzes all pages in the wiki and automatically inserts markdown links where page mentions are detected, creating a fully cross-referenced knowledge base.

## Testing

No automated tests are currently available for this component. Testing should focus on verifying link discovery accuracy, preventing duplicate links, and ensuring proper relative path generation across different wiki directory structures.