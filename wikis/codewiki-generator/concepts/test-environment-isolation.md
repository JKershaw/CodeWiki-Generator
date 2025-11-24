---
title: Test Environment Isolation
category: concept
sourceFile: tests/setup.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Test Environment Isolation

## Purpose and Overview

Test Environment Isolation establishes a controlled, sandboxed execution context for the test suite that prevents accidental external API calls and ensures reproducible, safe test behavior. By configuring environment variables and dummy credentials at setup time, this pattern enables fast, reliable tests that don't depend on real external services or incur actual costs.

## Key Functionality

This setup file configures the test environment by:

- **Setting TEST_MODE flag**: A global environment variable that signals all application components to use mocked implementations instead of real API clients
- **Injecting dummy credentials**: Replaces real API keys and tokens (e.g., `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`) with test-specific values like `test-key-not-real` and `test-token-not-real` to prevent unintended authentication
- **Establishing test defaults**: Configures test-specific values for resource paths (`test-wiki`) and safety limits (`MAX_DAILY_COST: 100`) that differ from production settings

Components throughout the application check the `TEST_MODE` variable to conditionally route to mock implementations, ensuring tests remain isolated from external dependencies regardless of their configuration.

## Relationships

- **Depends on**: Environment variable conventions used throughout the application (`ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `WIKI_PATH`, `MAX_DAILY_COST`)
- **Supports**: All test suites that check `TEST_MODE` to conditionally use mocks instead of real API clients
- **Enables**: Safe parallel test execution without rate limiting concerns, cost accumulation, or cross-test interference

## Usage Example

Components check the `TEST_MODE` variable to decide whether to use real or mocked implementations:

```javascript
// In application code that test suites exercise
const isTestMode = process.env.TEST_MODE === 'true';

if (isTestMode) {
  // Use mock API client
  apiClient = mockApiClient;
} else {
  // Use real API client with actual credentials
  apiClient = new RealApiClient(process.env.ANTHROPIC_API_KEY);
}

// Application logic proceeds identically regardless of which client is active
const result = apiClient.call(params);
```

The setup file initializes this environment before tests run:

```javascript
// tests/setup.js
process.env.TEST_MODE = 'true';
process.env.ANTHROPIC_API_KEY = 'test-key-not-real';
process.env.GITHUB_TOKEN = 'test-token-not-real';
process.env.WIKI_PATH = 'test-wiki';
process.env.MAX_DAILY_COST = '100';
```

## Testing

No automated tests are currently defined for the setup file itself. However, all test suites depend on this configuration being loaded before execution. Verify setup correctness by confirming that:

- Test suites execute without attempting real API connections
- Cost limits remain at the test default of 100
- Dummy credentials are never transmitted to external services