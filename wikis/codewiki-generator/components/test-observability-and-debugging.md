---
title: Test Observability and Debugging
category: component
sourceFile: playwright.config.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Test Observability and Debugging

## Purpose and Overview

Test Observability and Debugging provides comprehensive failure diagnostics and debugging capabilities for Playwright end-to-end tests. It automatically captures traces, screenshots, videos, and generates HTML reports to help developers understand test failures and analyze user interactions during test execution.

## Key Functionality

The component configures multiple debugging and observability features:

- **Trace Collection**: Records detailed execution traces on test failures, including network activity, DOM snapshots, and user actions
- **Screenshot Capture**: Automatically takes screenshots when tests fail to provide visual context of the failure state
- **Video Recording**: Records full test execution videos for comprehensive failure analysis
- **HTML Reporting**: Generates detailed HTML reports with test results, timelines, and debugging artifacts
- **Failure Artifact Management**: Organizes and stores all debugging materials in accessible formats for post-test analysis

These features work together to provide a complete picture of test execution, making it easier to identify root causes of failures and understand application behavior during testing.

## Relationships

This component integrates closely with:

- **E2E Testing Infrastructure**: Extends the core Playwright configuration with debugging capabilities across all supported browsers and test execution modes
- **CI/CD-aware Test Configuration**: Adapts artifact collection behavior based on environment (local vs CI) to balance debugging needs with performance and storage constraints
- Test execution pipeline: Provides debugging data that feeds into failure analysis workflows
- Development workflow: Supplies visual and technical debugging information to support rapid issue resolution

## Usage Example

The debugging configuration is automatically applied through the Playwright config:

```javascript
// playwright.config.js
module.exports = {
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [['html', { outputFolder: 'playwright-report' }]]
};
```

When tests run, artifacts are automatically collected on failures and accessible in the generated HTML report for analysis.

## Testing

No automated tests found for this configuration component.