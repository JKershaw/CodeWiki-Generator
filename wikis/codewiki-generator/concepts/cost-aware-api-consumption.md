---
title: Cost-aware API consumption
category: concept
sourceFile: lib/processor.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Cost-aware API consumption

**File Location:** `lib/processor.js`

## Purpose and [Overview](../meta/overview.md)

Cost-aware API consumption implements a system-wide pattern for tracking and limiting API costs during bulk processing operations. It provides configurable cost budgets that automatically pause processing when limits are reached, preventing unexpected expenses during large-scale repository analysis.

## Key Functionality

The cost-aware API consumption system:

- **Tracks cumulative costs** across processing sessions using ClaudeClient cost monitoring
- **Enforces configurable budgets** by pausing processing when cost thresholds are exceeded
- **Maintains cost state** persistently to track expenses across multiple processing runs
- **Integrates with batch processing** to provide real-time cost awareness during repository-scale operations
- **Provides cost visibility** to operators through logging and state reporting

The system works by monitoring API usage costs in real-time during processing workflows. When costs approach or exceed predefined limits, processing is gracefully paused, allowing operators to review expenses and adjust budgets before continuing.

## Relationships

This concept integrates with several core components:

- **ClaudeClient** - Provides the underlying cost tracking mechanism for API calls
- **Repository-scale batch processing** - Uses cost awareness to manage expenses during large processing jobs
- **StateManager** - Persists cost tracking data across processing sessions
- **Processor** - Implements cost checks and budget enforcement during commit-by-commit processing

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with cost-aware configuration
const processor = new Processor({
  costBudget: 50.00, // Maximum cost in dollars
  costTrackingEnabled: true
});

// Process repository with automatic cost monitoring
await processor.processRepository('https://github.com/user/repo', {
  maxCost: 25.00, // Per-session cost limit
  pauseOnBudgetExceeded: true
});
```

## Testing

**Test Coverage:** `tests/unit/processor.test.js`
- 26 test cases across 6 test suites
- Tests cover Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository functionality
- Includes mock implementations for cost tracking components and state management