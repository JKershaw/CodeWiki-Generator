---
title: Cost-aware API client wrapper
category: component
sourceFile: lib/claude.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# ClaudeClient

## Purpose and Overview

ClaudeClient is a production-ready wrapper around the Anthropic SDK that abstracts API communication with built-in cost tracking, resilient error handling, and token estimation. It enables developers to integrate Claude AI capabilities while maintaining visibility into token usage and associated costs.

## Key Functionality

### Message Communication
- **sendMessage(prompt, model)** – Sends a text prompt to Claude and returns the response with automatic usage tracking
- **sendMessageJSON(prompt, model)** – Sends a prompt and parses the response as JSON, with automatic extraction from markdown code blocks

### Cost Management
- **calculateCost(inputTokens, outputTokens, model)** – Computes USD cost based on model-specific pricing (stored in a pricing lookup table)
- **estimateTokens(text)** – Provides rough token count estimation using character-to-token ratios
- **getCostSummary()** – Returns accumulated token usage and total cost across all API calls
- **resetCost()** – Clears accumulated usage metrics

### Resilient API Communication
- Implements retry logic with exponential backoff for transient failures (rate limits, timeouts, API overload)
- Distinguishes recoverable errors (transient) from unrecoverable ones (authentication failures)
- Automatically tracks token usage and costs for each successful request

### Test Mode Support
- Lazy-loads the Anthropic SDK only when needed
- Detects test mode from the config module, enabling mock injection without external dependencies
- Allows tests to run without API keys or live API calls

## Relationships

- **Depends on**: `./config` module (API key and test mode detection) and `@anthropic-ai/sdk` (Claude API client)
- **Integrates with**: Cost tracking system via calculateCost and usage tracking methods
- **Supports**: Multiple Claude model variants with configurable, model-specific pricing

## Usage Example

```javascript
const ClaudeClient = require('./lib/claude');

// Initialize the client
const claudeClient = new ClaudeClient();

// Send a text message and get a response
const response = await claudeClient.sendMessage(
  'What is the capital of France?',
  'claude-3-sonnet-20240229'
);
console.log(response); // Returns text response with usage data

// Send a prompt expecting JSON output
const jsonResponse = await claudeClient.sendMessageJSON(
  'Return a JSON object with name and age fields',
  'claude-3-sonnet-20240229'
);
console.log(jsonResponse); // Returns parsed JSON object

// Check accumulated costs
const summary = claudeClient.getCostSummary();
console.log(summary); // { totalInputTokens, totalOutputTokens, totalCostUSD }

// Reset cost tracking for a new session
claudeClient.resetCost();
```

## Testing

ClaudeClient includes comprehensive test coverage with 21 test cases across 8 test suites covering:
- Constructor initialization
- Message sending and response handling
- JSON extraction and parsing
- Token estimation
- Cost calculation and summaries
- Cost reset functionality

Tests use dependency injection to mock the Anthropic SDK, enabling fast, reliable testing without external API calls. See `tests/unit/claude.test.js` for full test implementation.