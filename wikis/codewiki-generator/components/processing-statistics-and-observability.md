---
title: Processing statistics and observability
category: component
sourceFile: test-run.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Processing Statistics and Observability

## Purpose and Overview

The Processing statistics and observability component provides comprehensive tracking and visibility into CodeWiki Generator processing operations. It collects and reports detailed metrics about commits, files, pages, meta-analysis runs, and API costs, enabling developers to monitor processing behavior, validate performance, and implement cost-aware testing scenarios.

## Key Functionality

The component tracks multiple dimensions of processing activity:

- **Resource Processing Metrics**: Counts of commits processed, files analyzed, and pages generated during repository analysis
- **Meta-Analysis Tracking**: Number of meta-analysis operations performed throughout the processing pipeline
- **Cost Monitoring**: Real-time tracking of API costs incurred during processing operations, essential for budget-constrained scenarios
- **Processing Observability**: Comprehensive statistics that enable debugging, performance analysis, and validation of processing runs
- **Budget Validation Support**: Integration with cost-aware testing frameworks that enforce spending limits (such as the $2.00 limit used in development testing)

The statistics are collected throughout the processing pipeline and returned as a complete metrics object after repository analysis completion.

## Relationships

This component integrates with:

- **Processor**: The primary source of statistics data, collecting metrics throughout the repository analysis pipeline
- **Cost-aware testing framework**: Enables budget-constrained testing by providing real-time cost tracking for API usage
- **Self-referential processing**: Supports validation testing scenarios where the CodeWiki Generator processes its own repository
- **Repository analysis workflow**: Provides observability into each stage of the processing pipeline for debugging and optimization

## Usage Example

```javascript
const Processor = require('./processor');

const processor = new Processor();
const result = await processor.processRepository(repositoryPath, { maxCost: 2.00 });

// Access comprehensive processing statistics
console.log('Processing Statistics:', {
  commits: result.stats.commits,
  files: result.stats.files,
  pages: result.stats.pages,
  metaAnalysisRuns: result.stats.metaAnalysisRuns,
  totalCost: result.stats.cost
});
```

## Testing

No automated tests found. The component is validated through the test-run.js script which performs real-world testing on the CodeWiki Generator's own repository with a $2.00 budget constraint to prevent unexpected API expenses during development.