---
title: Flakiness Mitigation in Sandboxed Tests
category: guide
sourceFile: playwright.config.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Flakiness Mitigation in Sandboxed Tests

## Purpose and Overview

This configuration pattern addresses test instability and execution failures that occur when running Playwright tests in sandboxed or containerized environments. It implements specific browser launch arguments and execution strategies to overcome resource constraints and security restrictions that cause standard test configurations to fail.

## Key Functionality

The flakiness mitigation strategy operates through three key mechanisms:

- **Serial Test Execution**: Configures Playwright to use a single worker thread, preventing resource contention and process conflicts common in restricted environments
- **Retry Strategy**: Implements a baseline retry count of 1 to handle transient failures caused by sandbox limitations
- **Browser Security Bypass**: Applies critical Chromium flags (`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`, `--single-process`) to disable security features that conflict with containerized execution

This approach trades parallel execution performance for reliability in environments where standard browser automation would otherwise fail due to sandbox restrictions.

## Relationships

This configuration pattern works in conjunction with:

- **Sandboxed Environment Test Execution Strategy**: Provides the architectural foundation for serial test execution
- **Browser Launch Configuration for Restricted Environments**: Supplies the specific Chromium flags needed for sandbox compatibility
- **Playwright Test Runner**: Consumes these configuration settings to modify default execution behavior

## Usage Example

```javascript
// playwright.config.js
module.exports = {
  // Enable flakiness mitigation for sandboxed environments
  workers: 1, // Serial execution to avoid resource contention
  retries: 1,  // Handle transient sandbox failures
  
  use: {
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--single-process'
      ]
    }
  }
};
```

## Testing

No automated tests found for this configuration pattern. Testing would typically involve running the test suite in sandboxed environments (Docker containers, CI/CD pipelines) to verify successful execution and reduced flakiness compared to standard configurations.