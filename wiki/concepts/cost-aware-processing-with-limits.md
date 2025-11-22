---
title: Cost-aware processing with limits
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Cost-aware Processing with Limits

## Purpose and Overview

Cost-aware processing provides financial guardrails for large-scale repository analysis by monitoring API expenses and automatically halting processing when predefined spending limits are reached. This prevents runaway costs during extensive documentation generation while ensuring work can be resumed from the exact stopping point.

## Key Functionality

### Cost Monitoring
- Tracks cumulative API costs across all processing operations
- Enforces configurable spending limits per processing session
- Provides real-time cost visibility during long-running operations
- Automatically stops processing when limits are exceeded

### Processing Controls
- **Hard Limits**: Immediately halt all processing when cost threshold is reached
- **Soft Warnings**: Alert users when approaching spending limits
- **Session Budgets**: Set maximum spending per repository processing run
- **Cost Estimation**: Preview estimated costs before starting large operations

### State Preservation
- Saves processing progress immediately before cost limit interruption
- Maintains exact position in repository analysis workflow
- Preserves all generated documentation and intermediate results
- Enables seamless resumption with remaining budget

## Relationships

- **Integrates with ClaudeClient**: Intercepts API cost tracking to enforce limits
- **Coordinates with StateManager**: Persists cost data and processing checkpoints
- **Works with Repository Processing**: Provides cost oversight for batch operations
- **Supports MetaAnalysisAgent**: Tracks costs across periodic analysis cycles

## Usage Examples

### Setting Cost Limits
```javascript
const costLimits = {
  maxSessionCost: 50.00,      // Stop at $50
  warningThreshold: 40.00,    // Warn at $40
  estimatedTotal: 75.00       // Expected total cost
};

await processRepository(repoUrl, { costLimits });
```

### Monitoring During Processing
```javascript
// Real-time cost tracking
processor.on('costUpdate', ({ current, limit, percentage }) => {
  console.log(`Cost: $${current}/${limit} (${percentage}%)`);
});

// Automatic halt on limit
processor.on('costLimitReached', ({ totalCost, remainingWork }) => {
  console.log(`Processing stopped at $${totalCost}`);
  console.log(`Resume with: ${remainingWork.nextCommit}`);
});
```

### Resuming with New Budget
```javascript
// Resume with additional budget
await processRepository(repoUrl, {
  resume: true,
  costLimits: { maxSessionCost: 25.00 }  // Additional $25
});
```

## Configuration Options

- `maxSessionCost`: Maximum spending per processing session
- `warningThreshold`: Cost level that triggers warnings
- `costCheckInterval`: Frequency of cost limit verification
- `emergencyBuffer`: Reserved budget for cleanup operations
- `resumeOnNextBudget`: Automatically queue resumption when budget refreshes