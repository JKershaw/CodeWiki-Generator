---
title: Resilient API communication with exponential backoff
category: component
sourceFile: lib/claude.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Resilient API Communication with Exponential Backoff

## Purpose and Overview

The `ClaudeClient` class provides a resilient wrapper around the Anthropic SDK that handles transient API failures through exponential backoff retry logic. It distinguishes between recoverable errors (rate limits, timeouts, overload) and unrecoverable ones (authentication failures), ensuring robust production-ready communication with the Claude API while tracking costs and token usage.

## Key Functionality

### Retry Logic with Exponential Backoff
The `_retryRequest` method implements automatic retry behavior for transient failures:
- **Retryable errors**: Rate limit errors (429), timeout errors, and overload responses
- **Non-retryable errors**: Authentication failures (401/403) and client errors that fail immediately
- **Backoff strategy**: Exponential backoff with configurable max retry attempts
- **Jitter**: Prevents thundering herd by spacing retry attempts

### Message Sending
- `sendMessage(prompt)` - Sends text prompts and returns Claude's response with usage tracking
- `sendMessageJSON(prompt)` - Sends prompts expecting JSON responses, with automatic markdown code block parsing for structured data extraction

### Cost Tracking
- `calculateCost(inputTokens, outputTokens, model)` - Computes USD cost based on model-specific pricing rates
- `estimateTokens(text)` - Provides rough token count estimation using character-to-token ratio
- `getCostSummary()` - Returns accumulated cost and token usage statistics
- `resetCost()` - Clears cost tracking metrics

### Model Support
Includes pricing lookup tables for multiple Claude model variants with per-million-token rates for both input and output tokens.

## Relationships

- **Depends on** `./config` module for API key management and test mode detection
- **Wraps** `@anthropic-ai/sdk` to provide higher-level abstractions
- **Integrates with** cost tracking system for financial monitoring across API calls
- **Supports** multiple Claude model variants with dynamic pricing configuration

## Usage Example

```javascript
const ClaudeClient = require('./lib/claude');

// Initialize the client
const client = new ClaudeClient();

// Send a text message with automatic retry on transient failures
const response = await client.sendMessage('What is machine learning?');
console.log(response); // Returns text response with usage data

// Send a prompt expecting structured JSON output
const jsonResponse = await client.sendMessageJSON(
  'Return a JSON object with {name, description} for: artificial intelligence'
);
console.log(jsonResponse); // Automatically parsed from markdown code blocks

// Monitor costs
const summary = client.getCostSummary();
console.log(`Total cost: $${summary.totalCost}, Tokens used: ${summary.totalTokens}`);

// Reset tracking for a new billing cycle
client.resetCost();
```

## Testing

The `ClaudeClient` includes 21 comprehensive test cases across 8 test suites:

| Test Suite | Coverage |
|-----------|----------|
| Constructor | Initialization and API key handling |
| sendMessage | Text response handling and error paths |
| sendMessageJSON | JSON extraction and markdown parsing |
| estimateTokens | Token estimation accuracy |
| calculateCost | Cost calculation for different models |
| getCostSummary | Accumulated cost tracking |
| resetCost | Metric clearing |
| Retry Logic | Exponential backoff and error classification |

**Location**: `tests/unit/claude.test.js`

Tests use mock Anthropic SDK instances to verify behavior without external API calls, enabling safe testing in CI/CD environments and local development without requiring API credentials.