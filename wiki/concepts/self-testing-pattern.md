---
title: Self-testing pattern
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Self-testing Pattern

## Purpose and Overview

The self-testing pattern validates CodeWiki Generator functionality by running it on its own codebase. This demonstrates dogfooding principles and provides a practical way to verify the tool works correctly across different repository structures and code patterns.

## Key Functionality

**Cost-aware Testing**
- Sets explicit cost limits (`maxCost: 5`) to prevent runaway API expenses during validation
- Allows safe experimentation with different analysis configurations
- Provides early termination when cost thresholds are exceeded

**Safe Output Isolation** 
- Generates documentation to `generated-wiki/` directory instead of the development `dev-wiki/`
- Prevents accidental overwriting of hand-crafted documentation during testing
- Enables side-by-side comparison of generated vs. expected output

**Validation Workflow**
- Processes the entire repository using the same pipeline as production usage
- Exercises all major code paths including file discovery, analysis, and documentation generation
- Provides real-world testing data using the tool's own complexity and patterns

## Relationships

- **Uses**: `lib/processor.js` Processor class for core functionality
- **Demonstrates**: Proper usage of `processRepository()` method with configuration options
- **Integrates with**: Standard project structure and existing development workflows
- **Outputs to**: Isolated directory structure separate from development documentation

## Usage Examples

```bash
# Run self-test to validate functionality
node test-run.js

# Compare generated output with development documentation
diff -r dev-wiki/ generated-wiki/
```

**Configuration Example**
```javascript
const processor = new Processor({
  outputDir: 'generated-wiki',
  maxCost: 5,
  // other options...
});

await processor.processRepository('.');
```

The self-testing approach provides confidence in the tool's reliability while demonstrating proper usage patterns for end users.