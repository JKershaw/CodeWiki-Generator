---
title: Mock-First Testing Strategy
category: guide
sourceFile: tests/setup.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Mock-First Testing Strategy

## Purpose and Overview

The mock-first testing strategy establishes a controlled test environment where real external API calls are prevented and replaced with dummy implementations. This setup ensures tests run safely, quickly, and reproducibly without consuming actual API quotas or requiring valid credentials, while maintaining the ability to validate integration points through mock verification.

## Key Functionality

The testing strategy operates through environment-based configuration that signals all components to use mocked implementations:

**Core Configuration Elements:**

- **TEST_MODE environment variable**: A global flag that instructs all components to conditionally load mock implementations instead of real API clients. Components check this flag to determine whether to use production or test behavior.

- **Dummy Credentials**: Test-specific credential values (`test-key-not-real`, `test-token-not-real`) replace real API keys and tokens during test execution, preventing accidental authentication to external services and ensuring tests fail gracefully if mock detection fails.

- **Test Defaults**: Configuration values tailored for testing:
  - `WIKI_PATH`: Set to `test-wiki` for test-specific file isolation
  - `MAX_DAILY_COST`: Limited to `100` to prevent excessive resource consumption during test runs

**Isolation Guarantees:**

- Real credentials are never loaded in test environments
- External API calls cannot succeed even if code incorrectly attempts them
- Tests can run in parallel without rate limiting concerns or cumulative cost impacts
- Test behavior remains consistent across environments and developer machines

## Relationships

- **Depends on**: Environment variable conventions (`ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `WIKI_PATH`, `MAX_DAILY_COST`) used throughout the application
- **Supports**: All test suites that check `TEST_MODE` to conditionally instantiate mocks versus real clients
- **Enables**: Safe parallel test execution and CI/CD pipeline integration without external service dependencies

## Usage Example

Components should check `TEST_MODE` during initialization to determine whether to use mocks:

```javascript
// In a component that needs conditional mock behavior
const isTestMode = process.env.TEST_MODE === 'true';
const apiKey = process.env.ANTHROPIC_API_KEY;

if (isTestMode) {
  // Use mock implementation
  this.client = new MockApiClient(apiKey);
} else {
  // Use real API client
  this.client = new RealApiClient(apiKey);
}
```

Test setup ensures the environment is configured before running any tests:

```javascript
// tests/setup.js pattern
process.env.TEST_MODE = 'true';
process.env.ANTHROPIC_API_KEY = 'test-key-not-real';
process.env.GITHUB_TOKEN = 'test-token-not-real';
process.env.WIKI_PATH = 'test-wiki';
process.env.MAX_DAILY_COST = '100';
```

## Testing

No automated test coverage information is available for the setup file itself. However, this setup file enables all downstream tests by establishing the prerequisite environment configuration that prevents external API calls and ensures reproducible test behavior.