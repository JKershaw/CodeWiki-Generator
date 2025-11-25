---
title: Test-Friendly Configuration Defaults
category: guide
sourceFile: tests/setup.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Test-Friendly Configuration Defaults

## Purpose and Overview

Provides a centralized test setup that establishes safe, isolated configuration defaults for the test environment. This component ensures tests run with lightweight local settings and prevents accidental external service calls by injecting mock credentials and enforcing test-specific configurations.

## Key Functionality

- **Environment Isolation**: Sets environment variables to enforce mocked APIs and prevent real external service calls during test execution
- **Mock Credential Injection**: Automatically injects fake credentials for external services (Anthropic, GitHub) as a safety mechanism
- **Test-Optimized Defaults**: Configures lightweight settings including local wiki paths and high cost limits to enable fast, self-contained test runs
- **Global Test Setup**: Executes before test suites to establish consistent testing conditions across all tests

## Relationships

- **Test Runner Integration**: Loaded by the test runner before executing test suites to establish the testing environment
- **External Service Mocking**: Works in conjunction with API mocking mechanisms to ensure service calls are intercepted
- **Configuration System**: Overrides application configuration with test-specific values to isolate test execution
- **CI/CD Pipeline**: Ensures consistent test behavior across different environments by standardizing test configuration

## Usage Example

```javascript
// This setup is typically loaded automatically by the test runner
// For example, in Jest configuration:
// setupFilesAfterEnv: ['./tests/setup.js']

// The setup automatically configures test environment variables:
process.env.NODE_ENV = 'test';
process.env.ANTHROPIC_API_KEY = 'fake-test-key';
process.env.GITHUB_TOKEN = 'fake-github-token';
process.env.WIKI_PATH = './test-wiki';
process.env.COST_LIMIT = '999999';
```

## Testing

No automated tests found for this setup component, as it serves as the foundation for other tests rather than being tested itself.