---
title: Cost-aware API client wrapper
category: concept
sourceFile: lib/claude.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Cost-aware API client wrapper

## Purpose and Overview

The ClaudeClient provides a comprehensive wrapper around the Anthropic Claude API with built-in cost tracking, retry logic, and usage analytics. It enables applications to monitor API expenses in real-time while providing resilient communication with the Claude service through intelligent error handling and exponential backoff strategies.

## Key Functionality

- **Cost Tracking**: Automatically calculates and tracks costs for all API calls based on token usage and model pricing
- **Retry Logic**: Implements exponential backoff with status-specific handling for rate limits, timeouts, and service overloads
- **Flexible Messaging**: Supports both plain text and JSON response formats with automatic extraction from markdown code blocks
- **Test Mode Support**: Conditionally loads the Anthropic SDK to avoid expensive imports during testing
- **Token Estimation**: Provides cost estimation capabilities before making actual API calls
- **Model Support**: Handles multiple Claude models including Haiku 4.5 with interleaved thinking and tool support

The client abstracts the complexity of API communication while providing detailed visibility into usage patterns and costs through methods like `getCostSummary()` and `calculateCost()`.

## Relationships

This component serves as the primary interface between the application and the Anthropic Claude API. It integrates with:
- Configuration management for API keys and settings
- Test infrastructure through dependency injection patterns
- Logging and monitoring systems for cost and usage tracking
- Other application components that require AI text generation capabilities

## Usage Example

```javascript
const ClaudeClient = require('./lib/claude.js');

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

  // Example usage in production
  const client = new ClaudeClient();
  const response = await client.sendMessage("Hello, Claude!");
  const jsonResponse = await client.sendMessageJSON("Generate a JSON object");
  const costSummary = client.getCostSummary();
});
```

## Testing

**Test Coverage**: tests/unit/claude.test.js
- 29 test cases across 11 test suites
- Comprehensive coverage including constructor behavior, message sending, cost calculation, and specialized features
- Test categories cover: ClaudeClient initialization, sendMessage/sendMessageJSON methods, token estimation, cost tracking (estimateTokens, calculateCost, getCostSummary, resetCost), and advanced features (Haiku 4.5 support, interleaved thinking, tool support)