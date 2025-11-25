---
title: CI/CD-aware Test Configuration
category: guide
sourceFile: playwright.config.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# CI/CD-aware Test Configuration

## Purpose and Overview

The CI/CD-aware Test Configuration provides environment-specific test behavior that adapts between local development and continuous integration environments. It optimizes test execution by automatically adjusting retry strategies, worker allocation, and server management based on the execution context.

## Key Functionality

This configuration automatically detects the execution environment and applies appropriate settings:

- **Environment Detection**: Distinguishes between local development and CI pipeline execution
- **Adaptive Retry Logic**: Configures different retry counts for flaky tests based on environment
- **Worker Management**: Adjusts parallel test execution based on available resources
- **Server Reuse**: Optimizes development workflow by reusing existing servers locally while ensuring clean state in CI
- **Resource Optimization**: Balances test speed with resource consumption across different environments

The configuration ensures reliable test execution in automated pipelines while maintaining fast feedback loops during local development.

## Relationships

- **Integrates with E2E Testing Infrastructure**: Provides the foundational configuration layer that the Playwright testing framework uses for execution
- **Supports Test Observability and Debugging**: Works in conjunction with diagnostic tools by ensuring appropriate test conditions for artifact collection
- **Connected to Build Pipeline**: Automatically triggered and configured differently when running within CI/CD systems
- **Environment-dependent**: Reads environment variables and system context to determine appropriate configuration values

## Usage Example

The configuration automatically applies when running tests, but can be customized through environment variables:

```javascript
// Local development - uses development-optimized settings
npx playwright test

// CI environment - detected automatically, uses CI-optimized settings
// Typically configured in CI pipeline files like:
process.env.CI = 'true';
npx playwright test
```

The configuration automatically adjusts based on environment detection without requiring manual intervention.

## Testing

No automated tests found for the configuration itself, as this is a foundational configuration file that enables testing of other components.