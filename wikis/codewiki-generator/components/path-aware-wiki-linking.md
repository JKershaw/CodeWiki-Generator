---
title: Path-aware wiki linking
category: component
sourceFile: enhance-wiki-linking.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Path-aware Wiki Linking

## Purpose and Overview

The path-aware wiki linking component intelligently generates relative paths for markdown links between wiki files located in different directories. It automatically calculates the correct relative path from any source file to any target file, enabling seamless cross-directory navigation in wiki systems.

## Key Functionality

This component provides smart path resolution for wiki links by:

- **Relative Path Calculation**: Automatically determines the correct relative path between source and target files across different directory structures
- **Cross-Platform Compatibility**: Uses Node.js path module to ensure proper path resolution on different operating systems
- **Markdown Link Generation**: Creates properly formatted markdown links with calculated relative paths
- **Directory Structure Handling**: Manages complex directory relationships, including parent/child and sibling directory scenarios

The core functionality centers around the `createMarkdownLink` function, which takes the current file location and target file location as inputs and generates the appropriate relative markdown link.

## Relationships

This component integrates with several other parts of the wiki system:

- **Node.js Path Module**: Leverages built-in path utilities for reliable cross-platform path operations
- **Wiki Mention Detection**: Works in conjunction with systems that identify wiki page references
- **Markdown Generation Workflow**: Serves as a key component in the overall markdown link creation process

## Usage Example

```javascript
const { createMarkdownLink } = require('./enhance-wiki-linking');

// Generate a relative link from current file to target file
const currentFile = '/docs/guides/setup.md';
const targetFile = '/docs/api/methods.md';
const linkText = 'API Methods';

const markdownLink = createMarkdownLink(currentFile, targetFile, linkText);
// Result: [API Methods](../api/methods.md)
```

## Testing

No automated tests are currently available for this component.