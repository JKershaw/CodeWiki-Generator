---
title: Resilient retry logic with exponential backoff
category: component
sourceFile: lib/claude.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Resilient Retry Logic with Exponential Backoff

## Purpose and Overview

The `_retryRequest` method in ClaudeClient implements sophisticated retry handling with exponential backoff to provide fault tolerance for unreliable API interactions. It handles status-specific errors including rate limits, timeouts, and server overloads, automatically retrying failed requests with increasing delays to improve reliability and reduce API call failures.

## Key Functionality

This retry mechanism provides several key capabilities:

- **Status-specific retry logic** - Different handling for rate limits (429), timeouts, and server overload errors
- **Exponential backoff** - Progressively longer delays between retry attempts to avoid overwhelming the API
- **Configurable retry limits** - Prevents infinite retry loops while maximizing success probability
- **Error context preservation** - Maintains original error information when retries are exhausted
- **Integration with cost tracking** - Works seamlessly with the client's cost-aware API wrapper functionality

The retry logic analyzes HTTP status codes and error types to determine whether a request should be retried and calculates appropriate delay intervals using exponential backoff algorithms.

## Relationships

This component is tightly integrated with other ClaudeClient components:

- **Cost-aware API client wrapper** - Retry attempts are factored into cost calculations and usage tracking
- **Flexible message processing abstraction** - Both `sendMessage` and `sendMessageJSON` methods benefit from retry protection
- **Lazy-loaded SDK initialization** - Works with the conditionally loaded Anthropic SDK to handle connection failures

The retry logic serves as a foundational reliability layer that enhances all API interactions within the ClaudeClient.

## Usage Example

The retry logic is automatically applied to all API calls made through ClaudeClient methods:

```javascript
const ClaudeClient = require('./lib/claude');

const client = new ClaudeClient();
// Retry logic is automatically applied to sendMessage calls
const response = await client.sendMessage('Hello, Claude!');

// Also applies to JSON message calls
const jsonResponse = await client.sendMessageJSON('Provide data as JSON');
```

The retry mechanism operates transparently - users don't need to explicitly invoke retry logic as it's built into the API call methods.

## Testing

**Test Coverage**: `tests/unit/claude.test.js`
- 29 test cases across 11 test suites
- Comprehensive testing of ClaudeClient functionality including constructor, message sending methods, cost calculation, and specialized model support
- Test categories include: ClaudeClient, constructor, sendMessage, sendMessageJSON, estimateTokens, calculateCost, getCostSummary, resetCost, Haiku 4.5 support, Interleaved thinking support, and Tool support