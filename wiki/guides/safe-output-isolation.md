---
title: Safe output isolation
category: guide
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Safe Output Isolation

## Purpose and Overview

Safe output isolation prevents overwriting existing documentation by directing generated content to separate directories during testing and development. This pattern ensures that experimental runs or validation tests don't corrupt the primary documentation while still allowing full functionality testing.

## Key Functionality

The isolation mechanism works by:

- **Separate output directories** - Test runs generate content to isolated paths (e.g., `generated-wiki/` vs `dev-wiki/`)
- **Configuration override** - Output paths are specified during processor initialization to redirect all file operations
- **Complete isolation** - All generated files, including markdown pages, navigation, and assets, are contained within the test directory
- **Preservation of structure** - The isolated output maintains the same directory structure and file organization as production output

## Relationships

- **Works with**: `lib/processor.js` Processor class through `outputDir` configuration option
- **Enables**: [Self-testing pattern](Self-testing-pattern) by providing safe environment for validation runs
- **Supports**: [Cost-aware testing](Cost-aware-testing) by allowing multiple test iterations without file conflicts

## Usage Examples

### Basic Output Isolation

```javascript
const processor = new Processor({
  outputDir: 'generated-wiki',  // Isolated from main 'dev-wiki'
  costLimit: 5.00
});

await processor.processRepository('.');
```

### Multiple Test Environments

```javascript
// Development testing
const devProcessor = new Processor({
  outputDir: 'test-output/dev-run'
});

// Feature validation
const featureProcessor = new Processor({
  outputDir: 'test-output/feature-branch'
});
```

The isolation ensures that each run produces complete, independent documentation sets that can be compared, validated, or discarded without affecting the primary documentation workflow.