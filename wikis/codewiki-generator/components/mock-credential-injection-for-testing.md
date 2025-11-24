---
title: Mock credential injection for testing
category: component
sourceFile: tests/setup.js
related: [meta/overview.md, guides/test-isolation-through-environment-configuration.md]
created: 2025-11-24
updated: 2025-11-24
---

# Mock Credential Injection for Testing

## Purpose and [Overview](../meta/overview.md)

Mock credential injection substitutes real API credentials with test values during test execution to prevent unintended external service calls and maintain cost control. This component is part of the test setup infrastructure that ensures tests run safely in isolation without accessing production resources.

## Key Functionality

The mock credential injection system works by:

- **Environment variable substitution** - Replaces production API keys, tokens, and other sensitive credentials with safe test values
- **External call prevention** - Blocks accidental API requests to third-party services during test runs
- **Cost control** - Prevents test suites from incurring charges from external service usage
- **Test reliability** - Ensures consistent test behavior by removing dependencies on external service availability

The injection occurs during test setup, before any test code executes, establishing a clean testing environment with mocked authentication.

## Relationships

This component is closely integrated with:

- **[Test isolation through environment configuration](../guides/test-isolation-through-environment-configuration.md)** - Works together to create isolated test environments with controlled dependencies
- **Test setup infrastructure** - Part of the broader test initialization process that prepares the testing environment
- **External service integrations** - Specifically targets components that interact with third-party APIs requiring authentication

## Usage Example

```javascript
// tests/setup.js - Mock credential injection setup
process.env.API_KEY = 'mock-api-key-for-testing';
process.env.SECRET_TOKEN = 'mock-secret-token';
process.env.DATABASE_URL = 'mock://localhost/testdb';

// Prevents real API calls during testing
process.env.NODE_ENV = 'test';
```

## Testing

No automated tests found for this component. The mock credential injection system is itself a testing utility that supports the broader test suite infrastructure.