---
title: Test-driven code example extraction
category: component
sourceFile: Not specified
related: [concepts/enhanced-documentation-metadata-system.md]
created: 2025-11-23
updated: 2025-11-23
---

# Test-driven Code Example Extraction

## Purpose and Overview

Test-driven code example extraction automatically discovers and extracts relevant code examples from test files to enrich generated documentation. This component enhances the documentation generation process by finding real usage patterns and examples from the codebase's test suite, ensuring that documentation includes practical, working code samples.

## Key Functionality

The component uses pattern-matching strategies to scan test files and identify code examples that demonstrate how components are used in practice. It connects source files to their corresponding test files through naming conventions and extracts meaningful code snippets that show initialization, method calls, and typical usage patterns. The extracted examples are then integrated into the documentation metadata system for inclusion in generated wiki pages.

Key features include:
- Automatic discovery of test files based on source file paths
- Pattern matching to identify relevant code examples within test files
- Integration with the [enhanced documentation metadata system](../concepts/enhanced-documentation-metadata-system.md)
- Support for multiple test file naming conventions (`.test.js`, `.spec.js`, etc.)

## Relationships

This component extends the existing documentation infrastructure by:
- **Enhancing documentationWriterAgent**: Accepts additional metadata including extracted code examples
- **Integrating with wikiManager**: Leverages the page metadata system to store and organize extracted examples
- **Connecting source and test files**: Uses naming conventions to automatically link implementation files with their corresponding tests

## Usage Example

```javascript
const { extractCodeExamples } = require('./code-example-extractor');

// Extract examples for a specific source file
const sourceFile = './src/components/UserManager.js';
const examples = await extractCodeExamples(sourceFile);

// Examples are automatically integrated into documentation metadata
const documentationMetadata = {
  sourceFile: sourceFile,
  codeExamples: examples,
  lastExtracted: new Date().toISOString()
};

// Use with documentation writer
const enrichedDoc = await documentationWriterAgent.generate({
  ...baseContent,
  metadata: documentationMetadata
});
```

## Testing

No automated tests are currently available for this component. Testing should focus on validating pattern matching accuracy, handling various test file formats, and ensuring extracted examples are syntactically valid and contextually relevant.