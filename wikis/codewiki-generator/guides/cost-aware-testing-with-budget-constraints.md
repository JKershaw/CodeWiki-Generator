---
title: Cost-aware testing with budget constraints
category: guide
sourceFile: test-run.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Cost-aware Testing with Budget Constraints

## Purpose and [Overview](../meta/overview.md)

The cost-aware testing system provides a safe way to validate the CodeWiki Generator on real repositories while enforcing strict budget limits to prevent unexpected API expenses during development. This testing approach uses a predefined $2.00 cost limit to enable realistic validation without risking runaway costs from language model API calls.

## Key Functionality

- **Budget Enforcement**: Implements hard cost limits ($2.00) to prevent excessive API spending during testing phases
- **Self-Referential Testing**: Processes the CodeWiki Generator's own repository as a test case, providing realistic validation on familiar codebase patterns
- **Comprehensive Statistics**: Tracks and reports processing metrics including commits analyzed, files processed, documentation pages generated, meta-analysis runs, and cumulative costs
- **Development Safety**: Enables developers to test repository processing functionality without fear of unexpected billing charges

## Relationships

The cost-aware testing system connects to several core components:
- **Processor**: Uses the main processing engine to analyze repositories while monitoring API costs
- **Repository Analysis**: Leverages the same repository scanning and file processing logic used in production
- **Statistics Tracking**: Integrates with the observability system to capture detailed processing metrics
- **API Cost Monitoring**: Works with cost tracking mechanisms to enforce budget constraints

## Usage Example

```javascript
// test-run.js demonstrates cost-aware testing
const processor = new Processor({
  budgetLimit: 2.00, // $2.00 maximum spending
  // other configuration options
});

// Process the repository with budget constraints
const stats = await processor.run();
console.log('Processing complete:', stats);
// stats includes: commits, files, pages, metaAnalysisRuns, totalCost
```

## Testing

No automated tests are currently available for the cost-aware testing functionality. The component serves as a manual testing tool for validating the CodeWiki Generator's behavior on real repositories under controlled cost conditions.