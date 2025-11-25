---
title: Self-referential repository processing
category: component
sourceFile: test-run.js
related: [meta/overview.md, components/processing-statistics-and-observability.md]
created: 2025-11-25
updated: 2025-11-25
---

# Self-referential Repository Processing

## Purpose and [Overview](../meta/overview.md)

The self-referential repository processing component enables the CodeWiki Generator to test and validate its functionality by processing its own codebase. This provides a realistic testing environment that validates the tool's behavior on actual repository data before production deployment.

## Key Functionality

This component processes the CodeWiki Generator repository itself through the standard processing pipeline while maintaining safety constraints:

- **Budget-constrained execution**: Implements a $2.00 cost limit to prevent unexpected API expenses during testing and development
- **Complete processing cycle**: Runs the full analysis pipeline including commit processing, file analysis, page generation, and meta-analysis
- **Statistics collection**: Captures comprehensive metrics on commits processed, files analyzed, pages generated, meta-analysis runs, and actual costs incurred
- **Observability support**: Provides detailed processing statistics for debugging and validation of real-world test scenarios

The processing returns comprehensive statistics that track all aspects of the operation, enabling developers to understand the tool's behavior and resource consumption patterns.

## Relationships

- **Integrates with**: Main Processor component for executing the complete analysis pipeline
- **Provides feedback to**: Development workflow by validating tool functionality on realistic data
- **Enables**: Cost-aware testing strategies across the codebase
- **Supports**: [Processing statistics and observability](../components/processing-statistics-and-observability.md) components through detailed metrics collection

## Usage Example

```javascript
// Self-referential processing with budget constraints
const processor = new Processor();
const stats = await processor.processRepository({
  repository: 'current-repository',
  budgetLimit: 2.00
});

console.log(`Processed ${stats.commits} commits, ${stats.files} files`);
console.log(`Generated ${stats.pages} pages, cost: $${stats.totalCost}`);
```

## Testing

No automated tests found for this component. Testing is performed through manual execution of the self-referential processing script.