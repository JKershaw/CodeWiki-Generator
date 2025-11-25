---
title: Cost-aware testing framework
category: guide
sourceFile: test-run.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Cost-aware Testing Framework

## Purpose and Overview

The cost-aware testing framework provides a pattern for testing the CodeWiki Generator on itself while enforcing strict cost controls to prevent expensive API calls during development. It implements a $2.00 maximum cost limit as a safety mechanism when running the generator against codebases in test scenarios.

## Key Functionality

- **Cost Protection**: Enforces a hard limit of $2.00 per test run to prevent runaway API costs during development and testing cycles
- **Self-Validation**: Enables the CodeWiki Generator to process its own codebase as a validation mechanism, demonstrating the tool's capabilities while testing functionality
- **Isolated Output**: Uses separate output directories (generated-wiki/ vs dev-wiki/) to allow comparison between test runs and development iterations
- **Performance Metrics**: Collects and reports processing statistics including commits analyzed, files processed, wiki pages generated, meta-analysis runs, and total cost incurred

## Relationships

This framework is specifically designed for the **CodeWiki Generator** and implements **Self-referential repository processing** as its primary test case. It works alongside the **Processing statistics and observability** component to track and report test execution metrics. The cost controls integrate with whatever API cost tracking mechanisms the generator uses for external service calls.

## Usage Example

```javascript
// Run the cost-aware test with built-in safety limits
const testRun = require('./test-run.js');

// Configuration includes cost protection
const testConfig = {
  maxCost: 2.00,  // Hard limit to prevent expensive test runs
  outputDir: 'generated-wiki/',
  targetRepo: '.'  // Process current repository
};

// Execute test run with cost awareness
const results = testRun.execute(testConfig);
```

## Testing

No automated tests found for the testing framework itself, as this component serves as the primary testing mechanism for the broader system.