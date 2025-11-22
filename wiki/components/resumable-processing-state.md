---
title: Resumable processing state
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Resumable Processing State

## Purpose and Overview

Resumable processing state enables long-running repository analysis to be paused and resumed without losing progress. This component manages the persistent state needed to continue processing from where it left off, preventing wasted computation and API calls when processing is interrupted by cost limits, errors, or manual stops.

## Key Functionality

The resumable state system tracks:

- **Processing position** - Which commits, files, or analysis steps have been completed
- **Accumulated costs** - Running total of API expenses to enforce budget limits
- **Analysis artifacts** - Intermediate results from agents and meta-analysis runs
- **Error context** - Information about failures to support intelligent retry logic

The state persists automatically during processing and loads on restart, allowing the `processRepository` function to skip already-completed work. Cost tracking integration ensures processing halts gracefully when approaching budget limits, preserving all progress made up to that point.

## Relationships

The resumable state component integrates with several core systems:

- **StateManager** - Provides the underlying persistence layer for state storage and retrieval
- **processRepository function** - Consumes and updates state throughout repository processing
- **ClaudeClient cost tracking** - Feeds cost data into state for budget enforcement
- **MetaAnalysisAgent** - Stores periodic analysis results in state for progress assessment

## Usage Examples

### Basic State Management

```javascript
// State automatically saves during processing
await processRepository({
  repoUrl: 'https://github.com/user/repo',
  costLimit: 50.00,
  resumeFromState: true  // Loads existing state if available
});
```

### Manual State Inspection

```javascript
const state = StateManager.load('repo-analysis-state');
console.log(`Processed ${state.completedCommits.length} commits`);
console.log(`Current cost: $${state.accumulatedCost}`);
```

### Cost Limit Handling

When processing hits a cost limit, state preserves:
- All completed commit analyses
- Partial file processing results  
- Meta-analysis checkpoint data
- Exact stopping point for seamless resumption

The next processing run automatically continues from the saved position with the remaining budget.