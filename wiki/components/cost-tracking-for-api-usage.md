---
title: Cost tracking for API usage
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Cost Tracking for API Usage

## Purpose and Overview

This component implements comprehensive cost tracking and usage monitoring for AI API interactions, specifically designed for Anthropic's Claude models. It wraps API calls with automatic token counting, cost calculation, and usage metrics collection to provide visibility into AI service expenses and consumption patterns.

## Key Functionality

### Cost Calculation and Token Tracking
- **Token Estimation**: Uses a 4-character-per-token heuristic to approximate token counts for input text
- **Pricing Models**: Maintains per-million token pricing for different Claude model variants (input/output rates)
- **Usage Metrics**: Tracks total tokens consumed, cumulative costs, and request counts across API calls
- **Real-time Calculation**: Computes costs immediately after each API response using actual token usage

### Integration Points
- **ClaudeClient Wrapper**: Automatically applies cost tracking to all `sendMessage` and `sendMessageJSON` operations
- **Test Mode Support**: Bypasses actual API calls and cost accumulation during testing while maintaining interface compatibility
- **Configuration Driven**: Uses centralized config module for API keys and operational mode detection

### Retry and Error Handling
- **Exponential Backoff**: Implements retry logic for rate limits and transient API failures
- **Graceful Degradation**: Maintains cost tracking even when API calls fail or are retried

## Relationships

The cost tracking system integrates with several core components:

- **Configuration Module**: Retrieves API credentials and determines test/production mode
- **ClaudeClient**: Acts as the primary consumer, embedding cost tracking into all AI interactions
- **Test Infrastructure**: Provides null client behavior during automated testing
- **Anthropic SDK**: Wraps the official SDK with additional monitoring capabilities

## Usage Examples

### Basic Cost Monitoring
```javascript
const client = new ClaudeClient();
const response = await client.sendMessage("Analyze this data...");
// Cost automatically calculated and tracked internally
```

### Accessing Usage Metrics
```javascript
// Token estimation before API call
const estimatedTokens = client.estimateTokens(inputText);

// Cost calculation with actual usage
const cost = client.calculateCost(inputTokens, outputTokens, modelType);
```

### Pricing Configuration
```javascript
// Pricing structure (per million tokens)
const pricing = {
  'claude-3-haiku': { input: 0.25, output: 1.25 },
  'claude-3-sonnet': { input: 3.00, output: 15.00 }
};
```

The system maintains running totals of API usage, making it suitable for budget monitoring, usage optimization, and cost attribution across different application features.