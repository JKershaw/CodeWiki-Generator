---
title: Claude Client
category: components
created: 2025-11-22
updated: 2025-11-22
related:
  - prompts
  - agents/code-analysis
  - agents/documentation-writer
---

# Claude Client

## Purpose and Overview

The `ClaudeClient` class provides a wrapper around the Anthropic SDK for making API calls to Claude. It handles message sending, JSON response parsing, token estimation, cost tracking, and automatic retry logic for rate limits and network errors.

## Key Functionality

### Message Sending

The client provides two primary methods for sending messages:

- **`sendMessage(prompt, options)`**: Sends a text prompt and returns Claude's text response
- **`sendMessageJSON(prompt, options)`**: Sends a prompt expecting JSON and automatically parses the response

Both methods support:
- Custom model selection (defaults to claude-sonnet-4-20250514)
- Token limits via `maxTokens` option
- Automatic cost tracking
- Retry logic with exponential backoff

### Lazy Loading

To avoid ES module compatibility issues with Jest, the Anthropic SDK is lazy-loaded only when needed:

```javascript
let Anthropic = null;
if (config.shouldUseRealAPIs()) {
  if (!Anthropic) {
    Anthropic = require('@anthropic-ai/sdk');
  }
  this.anthropic = new Anthropic({ apiKey });
}
```

### Error Handling and Retries

The client automatically retries certain error types:
- **Rate limit errors** (status 429): Retries with exponential backoff
- **Timeout errors**: Retries up to maximum retry count
- **Authentication errors**: Fails immediately without retry

Retry logic uses exponential backoff: 2s, 4s, 8s delays between attempts.

### Cost Tracking

The client tracks cumulative API costs:
- Estimates tokens using ~4 characters per token heuristic
- Calculates cost based on model-specific pricing
- Provides cost summary via `getCostSummary()`
- Can be reset with `resetCost()`

Pricing (per million tokens):
- claude-sonnet-4-20250514: $3 input / $15 output

### JSON Response Parsing

The `sendMessageJSON()` method handles various response formats:
- Direct JSON responses
- JSON wrapped in markdown code blocks
- Malformed JSON (logs warning, returns empty object)

Example extraction:
```javascript
const jsonMatch = text.match(/```(?:json)?\\s*\\n([\\s\\S]*?)\\n```/);
if (jsonMatch) {
  return JSON.parse(jsonMatch[1]);
}
```

## Relationships

- **Used by**: All AI agents (CodeAnalysisAgent, DocumentationWriterAgent, MetaAnalysisAgent)
- **Uses**: Anthropic SDK (@anthropic-ai/sdk)
- **Depends on**: Config for API key and test mode detection

## Configuration

The client respects test mode to avoid real API calls during testing:
- In test mode: anthropic client remains null, calls are mocked
- In production: Lazy-loads SDK and makes real API calls
- API key sourced from environment variable `ANTHROPIC_API_KEY`

## Usage Example

```javascript
const ClaudeClient = require('./lib/claude');

const client = new ClaudeClient();

// Simple text request
const response = await client.sendMessage('Explain this code', {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 1000
});

// JSON request
const analysis = await client.sendMessageJSON('Analyze this: {...}', {
  maxTokens: 2000
});

// Check costs
const summary = client.getCostSummary();
console.log(`Total cost: $${summary.totalCost.toFixed(4)}`);
```
