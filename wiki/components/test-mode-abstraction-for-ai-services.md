---
title: Test-mode abstraction for AI services
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Test-mode abstraction for AI services

## Purpose and Overview

This component provides a test-friendly abstraction layer for AI service interactions, enabling code to run in test environments without making expensive API calls or requiring external dependencies. It conditionally loads AI SDKs based on environment configuration and provides comprehensive cost tracking and error handling for production usage.

## Key Functionality

### Test Mode Operation
- Detects test environment through configuration
- Conditionally loads the Anthropic SDK only when needed
- Nullifies the client in test mode to prevent accidental API calls
- Enables unit testing without external dependencies or API costs

### Production Features
- **Cost Tracking**: Monitors token usage and calculates costs based on model-specific pricing
- **Retry Logic**: Implements exponential backoff for rate limits and transient errors
- **Response Processing**: Handles both text and JSON responses with automatic markdown code block parsing
- **Token Estimation**: Provides approximate token counting using character-based heuristics

### Core Methods
- `sendMessage()` - Sends prompts and returns text responses with usage metrics
- `sendMessageJSON()` - Handles JSON responses with automatic parsing from markdown
- `estimateTokens()` - Calculates approximate token counts for cost estimation
- `calculateCost()` - Computes API costs based on input/output tokens and model pricing

## Relationships

- **Configuration Module**: Retrieves API keys and test mode flags
- **Anthropic SDK**: Conditionally loaded wrapper around `@anthropic-ai/sdk`
- **Test Infrastructure**: Integrates with testing framework through client nullification
- **Usage Tracking**: Maintains metrics for tokens consumed, costs incurred, and request counts
- **Error Handling**: Coordinates with retry mechanisms for robust API interactions

## Usage Examples

```javascript
// Production usage
const client = new ClaudeClient();
const response = await client.sendMessage("Explain quantum computing");
console.log(`Cost: $${response.cost}, Tokens: ${response.totalTokens}`);

// JSON response handling
const data = await client.sendMessageJSON("Return user preferences as JSON");
// Automatically parses JSON from markdown code blocks

// Test mode - no API calls made
process.env.NODE_ENV = 'test';
const testClient = new ClaudeClient(); // client.anthropic will be null
```

The abstraction ensures consistent behavior across environments while preventing accidental API usage during testing and providing detailed usage analytics for production monitoring.