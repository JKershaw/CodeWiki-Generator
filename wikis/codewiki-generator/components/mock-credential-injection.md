---
title: Mock Credential Injection
category: component
sourceFile: tests/setup.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Mock Credential Injection

## Purpose and Overview

Mock Credential Injection is a safety mechanism that injects fake credentials for external services during test execution to prevent accidental API calls and ensure test isolation. This component is part of the test setup infrastructure that establishes a secure testing environment by replacing real service credentials with dummy values.

## Key Functionality

- **Credential Substitution**: Automatically injects fake credentials for external services including Anthropic and GitHub APIs during test runs
- **API Call Prevention**: Acts as a safety net to prevent accidental calls to real external services that could incur costs or modify production data
- **Environment Isolation**: Works in conjunction with test environment configuration to create completely isolated test contexts
- **Automatic Setup**: Runs automatically as part of the test setup process without requiring manual intervention

## Relationships

Mock Credential Injection works closely with:

- **Test Environment Isolation**: Forms part of the broader test isolation strategy that prevents external service calls
- **Test-Friendly Configuration Defaults**: Complements other test configuration settings like local wiki paths and cost limits
- **Test Setup Infrastructure**: Integrated into the main test setup process in `tests/setup.js`

## Usage Example

The Mock Credential Injection runs automatically during test setup. Here's how it integrates into the testing environment:

```javascript
// Mock credentials are automatically injected during test setup
// This happens in tests/setup.js before any tests run

// Example of what gets mocked:
process.env.ANTHROPIC_API_KEY = 'fake-anthropic-key';
process.env.GITHUB_TOKEN = 'fake-github-token';

// Tests can then run safely without real API calls
const service = new ExternalService();
// This will use fake credentials and prevent real API calls
```

## Testing

No automated tests found for this component. The Mock Credential Injection mechanism is part of the test infrastructure itself and operates during the test setup phase to ensure all subsequent tests run in an isolated environment.