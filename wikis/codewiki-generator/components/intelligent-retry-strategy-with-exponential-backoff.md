---
title: Intelligent retry strategy with exponential backoff
category: component
sourceFile: lib/claude.js
related: [meta/overview.md, concepts/cost-aware-api-usage-tracking.md, guides/test-mode-aware-sdk-initialization.md]
created: 2025-11-25
updated: 2025-11-25
---

# Intelligent Retry Strategy with Exponential Backoff

## Purpose and [Overview](../meta/overview.md)

This component implements a resilient retry mechanism for API communication that handles transient failures and rate limits intelligently. It uses exponential backoff delays to progressively increase wait times between retry attempts while avoiding unnecessary retries for permanent failures like authentication errors.

## Key Functionality

The retry strategy provides several key capabilities:

- **Selective Retry Logic**: Automatically retries on rate limits and transient errors while skipping retries for authentication failures and other permanent errors
- **Exponential Backoff**: Implements progressive delay increases between retry attempts to reduce API load and improve success rates
- **Error Classification**: Distinguishes between retryable errors (rate limits, temporary failures) and permanent errors (authentication, validation failures)
- **Configurable Attempts**: Allows customization of maximum retry attempts based on use case requirements

The strategy integrates seamlessly with the ClaudeClient's API communication layer, automatically handling failed requests without requiring manual intervention from calling code.

## Relationships

This component is tightly integrated with the **Anthropic SDK wrapper** in `lib/claude.js`, where it handles all API communication failures. It works alongside:

- **[Cost-aware API usage tracking](../concepts/cost-aware-api-usage-tracking.md)** - ensures retry attempts are properly tracked for accurate cost calculations
- **[Test-mode aware SDK initialization](../guides/test-mode-aware-sdk-initialization.md)** - respects test mode configuration to avoid actual API calls during testing
- **Flexible message formatting** - maintains message format integrity across retry attempts

## Usage Example

```javascript
const ClaudeClient = require('./lib/claude');

// Initialize client - retry strategy is built-in
const claudeClient = new ClaudeClient();

// The retry strategy works automatically on any API call
try {
  const response = await claudeClient.sendMessage('Hello, Claude!');
  console.log(response);
} catch (error) {
  // Only non-retryable errors reach here
  console.error('Permanent failure:', error);
}

// JSON messages also benefit from retry protection
const jsonResponse = await claudeClient.sendMessageJSON('Analyze this data');
```

## Testing

**Test Coverage**: tests/unit/claude.test.js
- 29 test cases across 11 test suites
- Comprehensive testing includes retry behavior verification
- Test categories cover ClaudeClient constructor, sendMessage, sendMessageJSON, cost tracking methods, and model-specific features
- Mock implementations ensure retry logic can be tested without actual API calls