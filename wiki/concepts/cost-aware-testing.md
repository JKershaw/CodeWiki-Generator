---
title: Cost-aware testing
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Cost-aware Testing

## Purpose and Overview

Cost-aware testing implements controlled testing with explicit spending limits to prevent runaway expenses when using paid APIs. This approach ensures safe validation of functionality while protecting against unexpected charges during automated testing runs.

## Key Functionality

### Cost Limiting
- Sets explicit maximum cost thresholds before starting test runs
- Monitors API usage and halts execution when approaching limits
- Provides predictable expense control for continuous integration and development workflows

### Safe Testing Environment
- Uses isolated output directories to prevent overwriting production documentation
- Separates test artifacts from development files
- Enables safe experimentation without risk to existing work

### Validation Testing
- Verifies core functionality works correctly with real API calls
- Tests complete processing workflows end-to-end
- Provides confidence in system reliability before production use

## Relationships

### Dependencies
- **lib/processor.js**: Uses the Processor class to execute actual code analysis
- **Configuration system**: Leverages existing configuration options for cost management
- **Output management**: Integrates with directory handling for safe isolation

### Integration Points
- Works with any API-based processing that supports cost tracking
- Compatible with existing repository processing workflows
- Extends standard testing practices with financial guardrails

## Usage Examples

### Basic Cost-Limited Test
```javascript
const processor = new Processor();
await processor.processRepository('.', {
  outputDir: 'test-output/',
  maxCost: 2.00,  // Halt if costs exceed $2
  dryRun: false
});
```

### Self-Testing Pattern
```javascript
// Test the tool on its own codebase
await processor.processRepository('.', {
  outputDir: 'generated-wiki/',  // Separate from dev-wiki/
  maxCost: 1.50,
  skipExisting: false
});
```

### CI/CD Integration
Cost limits make automated testing safe for continuous integration environments where uncontrolled API usage could result in significant charges. Set conservative limits based on expected test scope and monitor actual usage patterns to refine thresholds over time.