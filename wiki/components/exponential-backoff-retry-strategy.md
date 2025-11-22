---
title: Exponential backoff retry strategy
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Exponential Backoff Retry Strategy

## Purpose and Overview

The exponential backoff retry strategy provides resilient handling of transient failures and rate limiting when making API calls to external services. This pattern automatically retries failed requests with progressively longer delays, preventing overwhelming of downstream services while maximizing success rates for recoverable errors.

## Key Functionality

The retry mechanism implements a controlled escalation approach:

- **Progressive Delays**: Each retry attempt waits exponentially longer (base delay × 2^attempt)
- **Error Classification**: Distinguishes between retryable errors (rate limits, timeouts) and permanent failures
- **Maximum Attempts**: Prevents infinite retry loops with configurable attempt limits
- **Jitter Support**: Can add randomization to delays to prevent thundering herd effects

### Retry Logic Flow

1. Execute the initial API request
2. On failure, evaluate if the error is retryable (429, 500, 502, 503, 504 status codes)
3. If retryable and under max attempts, wait for calculated delay period
4. Retry the request with incremented attempt counter
5. Repeat until success or max attempts exceeded

## Relationships

The exponential backoff strategy integrates with several system components:

- **AI API Client Wrapper**: Provides the retry infrastructure for Claude API calls
- **Cost Tracking**: Ensures failed requests don't inflate usage metrics inappropriately  
- **Configuration System**: Retrieves retry parameters and timeout settings
- **Error Handling**: Works with structured error responses to determine retry eligibility

## Usage Examples

```javascript
// Typical retry configuration
const retryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,    // 1 second initial delay
  maxDelay: 30000     // 30 second maximum delay
};

// Automatic retry on rate limit (429) or server errors (5xx)
try {
  const response = await client.sendMessage(prompt);
} catch (error) {
  // Non-retryable errors surface immediately
  // Retryable errors exhausted all attempts
}
```

The strategy is particularly effective for:
- **Rate Limit Recovery**: Respecting API quotas while maintaining throughput
- **Transient Network Issues**: Handling temporary connectivity problems
- **Server Overload**: Gracefully backing off when services are stressed
- **Batch Processing**: Ensuring reliable completion of large workloads