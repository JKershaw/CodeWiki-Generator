---
title: Standalone cross-linking utility
category: component
sourceFile: add-cross-links.js
related: [components/processor-class.md, meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Standalone Cross-linking Utility

## Purpose and [Overview](../meta/overview.md)

The standalone cross-linking utility is a command-line script that processes existing wiki content to retroactively add cross-page links between related pages. This utility operates independently of the main wiki generation pipeline, allowing cross-linking to be applied as a separate post-processing step on established content.

## Key Functionality

- **Batch Cross-link Processing**: Processes all pages in an existing wiki to identify and add cross-references between related content
- **Decoupled Operation**: Runs independently from the main wiki generation process, enabling flexible timing of cross-link addition
- **Processor Integration**: Utilizes the [Processor class](../components/processor-class.md) interface through the `addCrossLinksToAllPages` method to apply transformations across the entire wiki collection
- **Error Handling**: Implements standardized CLI error handling with detailed logging and proper exit codes

## Relationships

- **Depends on**: [Processor class](../components/processor-class.md) for batch page operations and cross-link generation logic
- **Operates on**: Existing wiki page collections that have already been generated
- **Complements**: Main wiki generation pipeline by providing post-processing capabilities
- **Establishes**: Pattern for standalone CLI utilities that perform wiki-wide transformations

## Usage Example

```javascript
// Run as a standalone CLI script
node add-cross-links.js

// The script internally follows this pattern:
// - Initializes processor for cross-linking operations
// - Calls addCrossLinksToAllPages method on all wiki pages
// - Handles errors with logging and appropriate exit codes
```

The utility is designed to be executed directly as a Node.js script from the command line, processing the entire wiki collection in a single operation.

## Testing

No automated tests are currently available for this component.