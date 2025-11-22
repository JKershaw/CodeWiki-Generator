---
title: Cost-controlled processing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Cost-controlled Processing

## Purpose and Overview

Cost-controlled processing manages API expenses during code analysis by setting explicit budget limits and monitoring usage. This approach prevents unexpected costs while enabling thorough testing and validation of the CodeWiki Generator on real codebases.

## Key Functionality

The cost control system operates through several mechanisms:

- **Budget enforcement** - Sets hard limits on API spending per processing run
- **Usage tracking** - Monitors token consumption and cost accumulation in real-time
- **Safe termination** - Stops processing when budget thresholds are reached
- **Statistics reporting** - Provides detailed cost breakdowns after completion

### Implementation Pattern

```javascript
// Example cost-controlled processing setup
const processor = new Processor({
  maxCost: 5.00,  // Hard budget limit
  trackUsage: true,
  stopOnBudget: true
});
```

The system tracks:
- Token usage per API call
- Cumulative cost across the entire run
- Processing statistics and efficiency metrics
- Error handling for budget overruns

## Relationships

### Dependencies
- **lib/processor.js** - Uses the Processor class for core analysis functionality
- **API cost tracking** - Integrates with token counting and pricing models

### Integration Points
- **Self-testing workflow** - Demonstrates cost control during dogfooding validation
- **Safe output separation** - Works with isolated output directories for testing
- **Statistics collection** - Provides data for optimization and planning

## Usage Examples

### Basic Cost-Controlled Run
```bash
# Run with $5 budget limit
node test-run.js --max-cost 5.00
```

### Testing Workflow
The cost control system enables safe experimentation:

1. **Set conservative budget** for initial testing
2. **Monitor usage patterns** to understand typical costs
3. **Adjust limits** based on project size and requirements
4. **Compare results** across different budget levels

This approach allows teams to validate tool behavior and estimate processing costs before committing to larger analysis runs.