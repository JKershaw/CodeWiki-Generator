---
title: Test-mode SDK initialization
category: component
sourceFile: lib/claude.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Test-mode SDK Initialization

## Purpose and Overview

Test-mode SDK initialization enables the ClaudeClient to conditionally load the Anthropic SDK, allowing tests to run without external API dependencies or requiring valid API credentials. This lazy-loading pattern separates the initialization concern from runtime usage, making the codebase testable in isolated environments.

## Key Functionality

The test-mode initialization system works through conditional SDK loading:

- **Lazy Loading**: The Anthropic SDK is loaded only when needed, not at module import time
- **Test Mode Detection**: The config module provides a test mode flag that determines whether to initialize the real SDK or use mock implementations
- **Dependency Isolation**: Tests can inject mock clients directly without requiring API keys from environment variables
- **Graceful Fallback**: In test environments, the SDK initialization is bypassed entirely, preventing authentication errors

The ClaudeClient constructor checks the test mode state and conditionally initializes the SDK. During testing, the mock Anthropic instance can be injected directly into the `client` property, allowing full control over API responses and behavior verification.

## Relationships

- **Depends on**: `./config` module for API key management and test mode detection flag
- **Wraps**: `@anthropic-ai/sdk` for Claude API communication (lazy-loaded)
- **Used by**: Test suites that mock the Anthropic SDK to verify ClaudeClient behavior without external calls
- **Integrates with**: Cost tracking and retry logic systems that rely on successful initialization

## Usage Example

```javascript
// In production (or when not in test mode)
const ClaudeClient = require('./lib/claude');
const claudeClient = new ClaudeClient();
const response = await claudeClient.sendMessage('Hello Claude');

// In tests (with mock injection)
const claudeClient = new ClaudeClient();
const mockAnthropic = {
  messages: {
    create: jest.fn().mockResolvedValue({
      content: [{ type: 'text', text: 'Mock response' }],
      usage: { input_tokens: 10, output_tokens: 5 }
    })
  }
};
claudeClient.client = mockAnthropic;
const testResponse = await claudeClient.sendMessage('Test prompt');
```

## Testing

The test-mode initialization is validated across 21 test cases organized in 8 test suites (tests/unit/claude.test.js), covering:

- **Constructor**: Verifies proper initialization with config-provided API key
- **Mock Injection**: Confirms that test mode allows direct client mocking without SDK loading
- **Message Handling**: Tests that mocked clients correctly process sendMessage and sendMessageJSON calls
- **Cost Tracking**: Validates cost calculations work with injected mock responses
- **Error Handling**: Ensures retry logic functions independently of SDK initialization

The testing pattern demonstrates that ClaudeClient remains fully functional in isolated environments while maintaining compatibility with production API usage.