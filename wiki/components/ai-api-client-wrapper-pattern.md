---
title: AI API client wrapper pattern
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# AI API Client Wrapper Pattern

## Purpose and Overview

The `ClaudeClient` provides a production-ready wrapper around the Anthropic SDK that adds essential capabilities like cost tracking, retry logic, and test mode support. It abstracts away the complexity of direct API integration while providing transparent usage monitoring and error handling for AI-powered features.

## Key Functionality

### Core Operations
- **Message sending** - Handles text and JSON-structured prompts with automatic response parsing
- **Cost tracking** - Calculates real-time API costs based on token usage and model-specific pricing
- **Token estimation** - Approximates token counts using a 4-character heuristic for budget planning
- **Retry handling** - Implements exponential backoff for rate limits and transient API failures

### Test Mode Integration
The client supports test mode through conditional dependency loading - when tests run, the Anthropic SDK is not loaded and API calls are bypassed, enabling fast unit testing without external dependencies.

### JSON Response Processing
The `sendMessageJSON` method automatically extracts JSON from markdown code blocks in Claude's responses, handling the common pattern where AI models wrap structured data in formatting.

## Relationships

```
ClaudeClient
├── config module (API keys, test mode flags)
├── @anthropic-ai/sdk (lazy loaded in production)
├── Usage tracking (tokens, costs, request counts)
└── Application features (AI-powered functionality)
```

The client serves as the primary interface between application code and Claude AI, centralizing all API interactions and providing consistent error handling and monitoring across features.

## Usage Examples

### Basic text generation
```javascript
const client = new ClaudeClient();
const response = await client.sendMessage("Explain quantum computing");
console.log(`Cost: $${client.totalCost}, Tokens: ${client.totalTokens}`);
```

### Structured data extraction
```javascript
const data = await client.sendMessageJSON(
  "Extract contact info from this text as JSON: ..."
);
// Automatically parses JSON from Claude's markdown-wrapped response
```

### Cost estimation
```javascript
const estimatedTokens = client.estimateTokens(prompt);
const estimatedCost = client.calculateCost(estimatedTokens, 0, 'claude-3-sonnet');
```

## Configuration

Pricing is configured per model with separate rates for input and output tokens. The client automatically selects appropriate pricing based on the model specified in requests, enabling accurate cost tracking across different Claude variants.