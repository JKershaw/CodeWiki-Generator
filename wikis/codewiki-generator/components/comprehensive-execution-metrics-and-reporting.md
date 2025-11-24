---
title: Comprehensive execution metrics and reporting
category: component
sourceFile: test-run.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Comprehensive Execution Metrics and Reporting

## Purpose and Overview

The `test-run.js` file serves as a self-validation framework for the CodeWiki Generator, executing the tool against its own repository to verify functionality and capture detailed processing statistics. It demonstrates the system's cost-aware design while producing comprehensive metrics about operation success, resource consumption, and output quality.

## Key Functionality

This component captures and reports detailed execution statistics throughout the repository processing lifecycle:

- **Processing Statistics**: Tracks the number of commits analyzed, files processed, wiki pages generated, and API tokens consumed
- **Cost Monitoring**: Enforces monetary limits during processing to manage API expenses and prevent unexpected costs during testing and production runs
- **Output Comparison**: Generates documentation in a separate `generated-wiki/` directory, allowing side-by-side comparison with existing development wikis
- **Stop Reason Tracking**: Records why processing terminated (completion, cost limit reached, error conditions)
- **Performance Visibility**: Provides detailed insights into system behavior and processing performance through comprehensive metric collection

The component orchestrates processing through the `Processor` class, applying configurable parameters including cost limits and meta-analysis frequency to control processing scope and resource consumption.

## Relationships

- **Depends on**: `Processor` class from `./lib/processor` module for core repository processing
- **Test Subject**: Processes the CodeWiki Generator's own repository as a real-world validation target
- **Output Location**: Writes generated documentation to `generated-wiki/` directory for comparison and validation
- **Configuration Source**: Uses cost limits and analysis frequency parameters to control processing behavior
- **Metrics Consumer**: Reports comprehensive statistics and processing outcomes back to the calling context

## Usage Example

```javascript
const { Processor } = require('./lib/processor');

const processor = new Processor();
const stats = await processor.processRepository({
  owner: 'repository-owner',
  repo: 'repository-name',
  costLimitDollars: 5.00,
  metaAnalysisFrequency: 10
});

console.log(`Commits processed: ${stats.commits}`);
console.log(`Files analyzed: ${stats.files}`);
console.log(`Pages generated: ${stats.pages}`);
console.log(`Total cost: $${stats.totalCost}`);
console.log(`Stop reason: ${stats.stopReason}`);
```

## Key Configuration Options

- **costLimitDollars**: Maximum API spending threshold before processing halts
- **metaAnalysisFrequency**: Interval for running meta-analysis during processing
- **outputDirectory**: Target location for generated wiki documentation

## Testing

No automated test suite currently exists for this component. Testing is performed through manual execution of the `test-run.js` script itself, with validation achieved by comparing generated output against the development wiki and reviewing reported metrics for accuracy and completeness.