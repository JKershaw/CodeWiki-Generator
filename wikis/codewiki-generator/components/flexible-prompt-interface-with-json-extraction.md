---
title: Flexible prompt interface with JSON extraction
category: component
sourceFile: lib/claude.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Flexible Prompt Interface with JSON Extraction

## Purpose and Overview

The `ClaudeClient` provides a flexible interface for communicating with Claude AI that supports both conversational text responses and structured JSON data extraction. It wraps the Anthropic SDK with production-ready features including automatic cost tracking, resilient retry logic with exponential backoff, and intelligent markdown code block parsing for JSON responses.

## Key Functionality

### Dual Message Interface

**`sendMessage(prompt, options)`** - Sends a text prompt to Claude and returns the response as a string, ideal for conversational interactions and natural language processing.

**`sendMessageJSON(prompt, options)`** - Sends a prompt expecting a JSON response, automatically extracts JSON from markdown code blocks (`` ```json ... ``` ``), and parses it into a JavaScript object. This enables structured data extraction while allowing Claude to format responses naturally.

### Cost Awareness

The client automatically tracks token usage and associated costs:

- **`calculateCost(inputTokens, outputTokens, model)`** - Computes USD cost based on model-specific pricing per million tokens
- **`getCostSummary()`** - Returns cumulative usage statistics and total cost across all API calls
- **`resetCost()`** - Clears accumulated cost tracking data

Model pricing is configurable via the `pricing` constant, supporting multiple Claude model variants.

### Reliability Features

- **`_retryRequest(fn, maxRetries)`** - Implements exponential backoff retry logic for transient failures (rate limits, timeouts, server overload)
- Distinguishes between recoverable errors (which trigger retries) and unrecoverable errors like authentication failures
- Automatic token estimation via **`estimateTokens(text)`** using character-to-token ratio for cost prediction

### Test Mode Support

The client supports lazy initialization and test mode detection, allowing tests to run without external API dependencies by injecting mock instances.

## Relationships

- **Dependencies**: Imports configuration (API key, test mode) from `./config` module
- **External SDK**: Wraps `@anthropic-ai/sdk` for Claude API communication
- **Cost Integration**: Works with the application's cost tracking system to log and summarize usage
- **Model Flexibility**: Supports multiple Claude model variants with model-specific pricing configuration

## Usage Example

```javascript
const ClaudeClient = require('./lib/claude');

// Initialize the client
const claude = new ClaudeClient();

// Send a text message and get conversational response
const textResponse = await claude.sendMessage('Explain quantum computing');
console.log(textResponse);

// Send a prompt expecting structured JSON
const jsonResponse = await claude.sendMessageJSON(
  'Extract the title, author, and year from this book description: ...'
);
console.log(jsonResponse.title); // Access structured data

// Monitor costs
const costSummary = claude.getCostSummary();
console.log(`Total cost: $${costSummary.totalCost}`);
console.log(`Tokens used: ${costSummary.totalTokens}`);
```

## Testing

The component has comprehensive test coverage with 21 test cases across 8 test suites in `tests/unit/claude.test.js`. Tests cover:

- Constructor initialization
- `sendMessage()` text responses
- `sendMessageJSON()` JSON extraction and markdown parsing
- Token estimation accuracy
- Cost calculations across models
- Cost summary aggregation and reset
- Retry logic and error handling
- Test mode conditional initialization

The test suite uses mocking to inject a mock Anthropic client, enabling fast tests without external API calls or authentication requirements.