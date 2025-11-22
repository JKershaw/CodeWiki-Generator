---
title: Token-based pricing calculation
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Token-based Pricing Calculation

## Purpose and Overview

The token-based pricing calculation system provides cost tracking and billing estimation for AI API usage across different Claude models. It calculates costs based on input and output token consumption using per-model pricing rates, enabling budget monitoring and usage analytics for AI-powered features.

## Key Functionality

### Cost Calculation
- **Token-based pricing**: Calculates costs using separate rates for input and output tokens per million tokens
- **Model-specific rates**: Maintains pricing configuration for different Claude model variants (Haiku, Sonnet, Opus)
- **Real-time tracking**: Accumulates total costs and token usage across API requests

### Token Estimation
- **Character-based heuristic**: Estimates token count using a 4-characters-per-token approximation
- **Pre-request estimation**: Allows cost prediction before making actual API calls
- **Usage validation**: Helps validate estimated vs actual token consumption

### Pricing Configuration
```javascript
const pricing = {
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  'claude-3-sonnet-20240229': { input: 3, output: 15 },
  'claude-3-opus-20240229': { input: 15, output: 75 }
};
```

## Relationships

### Integration Points
- **ClaudeClient**: Primary consumer that calls `calculateCost()` after each API response
- **Usage tracking**: Feeds into broader API usage metrics and monitoring systems
- **Configuration system**: Uses model pricing data to determine appropriate rates
- **Test infrastructure**: Bypassed during test mode to avoid billing calculations

### Data Flow
1. API response provides actual input/output token counts
2. `calculateCost()` applies model-specific pricing rates
3. Costs accumulate in client instance for session tracking
4. Token estimation provides pre-request cost forecasting

## Usage Examples

### Basic Cost Calculation
```javascript
const cost = calculateCost('claude-3-sonnet-20240229', 1000, 500);
// Returns cost for 1000 input tokens + 500 output tokens
```

### Token Estimation
```javascript
const estimatedTokens = estimateTokens(userPrompt);
const estimatedCost = calculateCost(modelName, estimatedTokens, 0);
```

### Usage Tracking
The pricing system integrates automatically with `ClaudeClient` operations, accumulating costs in `this.totalCost` and token usage in `this.totalTokens` for session-level budget monitoring.