---
title: Self-referential repository processing
category: concept
sourceFile: test-run.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Self-referential repository processing

## Purpose and Overview

Self-referential repository processing is an architectural pattern that allows the CodeWiki Generator to process its own codebase as a validation and testing mechanism. This approach provides a practical way to verify the generator's functionality while demonstrating its capabilities on a real codebase.

## Key Functionality

The self-referential processing system enables the generator to analyze its own source code and produce documentation, creating an isolated output directory (`generated-wiki/`) that can be compared against the development wiki (`dev-wiki/`). This pattern includes built-in cost controls with a maximum spending limit ($2.00) to prevent expensive API calls during development and testing cycles.

The system tracks comprehensive processing statistics including:
- Number of commits processed
- Files analyzed
- Documentation pages generated
- Meta-analysis runs executed
- API costs incurred

## Relationships

This concept integrates with several other components:
- **Cost-aware testing framework**: Provides the cost control mechanisms that prevent runaway expenses during self-processing
- **Processing statistics and observability**: Supplies the metrics collection system that monitors generator performance during self-analysis
- Repository analysis components that parse and process the codebase structure
- Documentation generation systems that create the final wiki output

## Usage Example

```javascript
// Self-referential processing with cost controls
const generator = new CodeWikiGenerator({
  maxCost: 2.00,
  outputDir: 'generated-wiki/',
  enableMetrics: true
});

// Process the current repository
const stats = await generator.processRepository('.');
console.log(`Processed ${stats.files} files, generated ${stats.pages} pages`);
```

## Testing

No automated tests found for this component. The self-referential processing serves as both a functional validation and a form of integration testing, where successful generation of documentation from the generator's own codebase demonstrates correct operation.