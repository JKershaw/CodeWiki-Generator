---
title: Test-integrated documentation system
category: concept
sourceFile: Not specified
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Test-integrated Documentation System

## Purpose and Overview

The test-integrated documentation system automatically extracts code examples from test files to enhance generated documentation, creating a self-documenting codebase where tests serve dual purposes as both verification and living documentation. This system bridges the gap between code testing and documentation by leveraging existing test cases as real-world usage examples.

## Key Functionality

- **Automatic Code Example Extraction**: Scans test files using multiple path patterns to find and extract relevant code examples that demonstrate actual usage
- **Source File Tracking**: Maintains systematic tracking of source file paths in documentation metadata, enabling complete traceability between generated docs and their originating code
- **Documentation Enhancement**: Enriches generated documentation with real, tested code examples rather than manually maintained samples that can become outdated
- **Self-Updating Documentation**: Ensures documentation examples stay current as tests are updated, reducing maintenance overhead

## Relationships

- **Extends** `documentationWriterAgent.writeDocumentation` by providing additional context from extracted test examples
- **Enhances** `wikiManager` page metadata with comprehensive source file tracking capabilities  
- **Integrates** with the file system to create seamless bridges between test files and their corresponding documentation

## Usage Example

```javascript
const { extractCodeExamples } = require('./test-integrated-docs');

// Extract examples from test files for a component
const examples = await extractCodeExamples('src/components/userManager.js', {
  testPaths: ['test/**/*.test.js', 'spec/**/*.spec.js'],
  includeSetup: true
});

// Generate documentation with integrated test examples
const documentation = await documentationWriterAgent.writeDocumentation({
  sourceFile: 'src/components/userManager.js',
  codeExamples: examples,
  includeSourceTracking: true
});

// Add to wiki with enhanced metadata
await wikiManager.addPage(documentation, {
  sourceFile: 'src/components/userManager.js',
  testFiles: examples.sourceFiles,
  lastUpdated: new Date()
});
```

## Testing

No automated tests found for this component. Consider adding tests to verify code example extraction accuracy and documentation generation quality.