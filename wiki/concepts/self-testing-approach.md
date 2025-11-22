---
title: Self-testing approach
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Self-testing Approach

## Purpose and Overview

The self-testing approach demonstrates dogfooding by running CodeWiki Generator on its own codebase to validate functionality and output quality. This provides real-world validation while serving as a practical example of the tool's capabilities.

## Key Functionality

### Test Execution Process

The test runner (`test-run.js`) orchestrates a complete processing cycle:

- **Safe Output Isolation**: Generates documentation to `generated-wiki/` directory, preventing interference with the development wiki in `dev-wiki/`
- **Cost-Controlled Processing**: Implements explicit budget limits to manage API costs during real-world testing
- **Comprehensive Statistics**: Reports processing metrics including file counts, API usage, and execution time
- **Error Handling**: Captures and reports failures without interrupting the testing workflow

### Cost Management Strategy

```javascript
const processor = new Processor({
  outputDir: 'generated-wiki',
  costLimit: 5.0  // Explicit budget control
});
```

The test runner demonstrates practical cost control by setting clear spending limits, showing how to use the tool responsibly in production scenarios.

### Validation Workflow

The self-testing process validates:
- **Processing Pipeline**: Ensures all analysis and generation steps complete successfully
- **Output Quality**: Produces documentation that can be manually reviewed for accuracy
- **Performance Characteristics**: Measures real-world processing time and resource usage
- **API Integration**: Validates external service connectivity and response handling

## Relationships

- **Uses**: `lib/processor.js` Processor class as the primary processing engine
- **Outputs**: Separate documentation tree in `generated-wiki/` for comparison with `dev-wiki/`
- **Demonstrates**: Real-world usage patterns and best practices for the main processing API

## Usage Examples

### Running Self-Test

```bash
node test-run.js
```

The script processes the entire codebase and outputs comprehensive statistics:

```
Processing completed successfully!
Files processed: 15
Total cost: $2.34
Processing time: 45.2s
```

### Comparing Results

After running, compare the generated documentation with the development version:

```bash
diff -r dev-wiki/ generated-wiki/
```

This reveals any discrepancies between expected and actual output, helping identify regressions or improvements in the generation logic.