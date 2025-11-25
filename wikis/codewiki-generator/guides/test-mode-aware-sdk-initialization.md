---
title: Test-mode aware SDK initialization
category: guide
sourceFile: lib/claude.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Test-mode aware SDK initialization

## Purpose and [Overview](../meta/overview.md)

Test-mode aware SDK initialization is a pattern that conditionally loads the Anthropic SDK based on the application's test mode configuration. This allows tests to run without loading the actual SDK dependencies or incurring API costs while maintaining the same interface for production code.

## Key Functionality

The ClaudeClient implements lazy initialization where the Anthropic SDK is only loaded when needed and not in test mode:

- **Conditional Loading**: The SDK is only instantiated when the application is not running in test mode
- **Mock Injection**: In test environments, mock clients can be injected to replace the real SDK
- **Lazy Initialization**: The actual client is created on first use rather than at construction time
- **Clean Interface**: The same ClaudeClient interface works seamlessly in both test and production modes

This pattern prevents test suites from requiring the full Anthropic SDK dependency and avoids accidental API calls during testing.

## Relationships

This component connects to:

- **Configuration System**: Reads test mode settings to determine initialization behavior
- **Test Framework**: Works with Jest mocks and test setup to provide controllable behavior
- **Anthropic SDK**: Wraps the official Anthropic client when not in test mode
- **Cost Tracking**: Maintains API usage tracking regardless of test/production mode
- **Message Processing**: Provides the foundation for AI message handling across the application

## Usage Example

```javascript
describe('ClaudeClient', () => {
  let claudeClient;
  let mockAnthropic;

  beforeEach(() => {
    // Create mock Anthropic instance
    mockAnthropic = {
      messages: {
        create: jest.fn()
      }
    };

    // In test mode, ClaudeClient should use mocks
    claudeClient = new ClaudeClient();
    // Inject mock for testing
    claudeClient.client = mockAnthropic;
  });

  it('should initialize with API key from config', () => {
    const client = new ClaudeClient();
    // Client initializes without loading actual SDK in test mode
  });
});
```

## Testing

**Test Coverage**: tests/unit/claude.test.js
- 29 test cases across 11 test suites
- Comprehensive testing of constructor behavior, message handling, cost tracking, and model support
- Tests verify proper mock injection and test-mode initialization patterns
- Coverage includes Haiku 4.5 support, interleaved thinking, and tool support functionality