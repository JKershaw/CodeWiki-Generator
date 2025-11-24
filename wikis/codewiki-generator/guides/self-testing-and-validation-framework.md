---
title: Self-testing and validation framework
category: guide
sourceFile: test-run.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Self-Testing and Validation Framework

## Purpose and Overview

The `test-run.js` file establishes a self-testing pattern where the CodeWiki Generator validates itself by processing its own repository. This enables developers to verify that changes produce expected wiki output before deploying to production, with built-in cost management and comprehensive performance metrics to ensure reliability and control API expenses.

## Key Functionality

This framework orchestrates a complete test run of the repository processing pipeline with the following capabilities:

- **Automated Repository Processing**: Executes the full CodeWiki Generator workflow against the target repository (typically the CodeWiki Generator's own codebase)
- **Cost-Bounded Execution**: Enforces monetary limits during processing to prevent unexpected API expenses during testing and validation
- **Comprehensive Metrics Reporting**: Captures and displays detailed statistics including:
  - Number of commits processed
  - Files analyzed
  - Wiki pages generated
  - API costs incurred
  - Processing completion status and stop reasons
- **Configurable Processing Parameters**: Supports tuning of cost limits and meta-analysis frequency to balance thoroughness with resource constraints
- **Separated Output**: Generates wiki output to a dedicated `generated-wiki/` directory, allowing comparison against the reference `dev-wiki/` for validation

## Relationships

- **Depends on**: The `Processor` class from the `./lib/processor` module, which handles the core repository analysis and documentation generation
- **Input**: Targets the CodeWiki Generator repository itself as the test subject
- **Output**: Writes to `generated-wiki/` directory for comparison and validation
- **Configuration**: Uses cost limits and meta-analysis frequency as primary tuning parameters
- **Reporting**: Returns comprehensive execution statistics from the processor for analysis and debugging

## Usage Example

```javascript
const { main } = require('./test-run');

// Execute the self-testing framework
main()
  .then(() => {
    console.log('Test run completed successfully');
  })
  .catch((error) => {
    console.error('Test run failed:', error);
    process.exit(1);
  });
```

Alternatively, run directly from the command line:

```bash
node test-run.js
```

The script will process the repository, generate wiki documentation to `generated-wiki/`, and output execution metrics including commit counts, file statistics, and API cost information to validate the generator's behavior.

## Testing

No automated test coverage is currently available for this component. Validation occurs through manual execution of the test run and comparison of generated output against expected wiki structure and content in the `dev-wiki/` directory.