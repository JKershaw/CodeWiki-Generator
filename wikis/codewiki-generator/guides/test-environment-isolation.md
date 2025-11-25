---
title: Test Environment Isolation
category: guide
sourceFile: tests/setup.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Test Environment Isolation

## Purpose and Overview

Test Environment Isolation establishes a critical testing pattern that prevents real external service calls during test execution by enforcing mocked APIs and injecting safe configuration defaults. This component ensures tests remain fast, predictable, and completely isolated from external dependencies like Anthropic or GitHub APIs.

## Key Functionality

The test setup implements several isolation mechanisms:

- **Mock Credential Injection** - Automatically injects fake credentials for external services (Anthropic, GitHub) to prevent accidental API calls during test runs
- **Environment Configuration** - Sets up test-specific environment variables and configuration that override production settings
- **Test-Friendly Defaults** - Establishes lightweight defaults including local wiki paths and high cost limits to enable self-contained test execution
- **API Call Prevention** - Acts as a safety net to ensure no real external service calls occur during testing

## Relationships

This component serves as the foundation for the entire test suite:

- **Test Files** - All test files depend on this setup to run in an isolated environment
- **External Service Integrations** - Overrides real API credentials and endpoints for services like Anthropic and GitHub
- **Configuration System** - Works with the application's configuration system to provide test-specific overrides
- **Mock Framework** - Coordinates with mocking utilities to ensure consistent test behavior

## Usage Example

The test setup runs automatically when the test suite is executed, but the isolation can be verified:

```javascript
// Test setup runs automatically before tests
// Environment will have mock credentials injected
console.log(process.env.ANTHROPIC_API_KEY); // "fake-test-key"
console.log(process.env.GITHUB_TOKEN); // "fake-test-token"

// Configuration defaults are set for test isolation
const config = require('./config');
console.log(config.wikiPath); // "./test-wiki"
console.log(config.costLimit); // 1000
```

## Testing

No automated tests found for the test setup itself - this component serves as the foundation that enables testing of other components.