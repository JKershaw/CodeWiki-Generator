---
title: Background Processing with State Persistence
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Background Processing with State Persistence

## Purpose and Overview

Background Processing with State Persistence decouples HTTP request/response cycles from long-running repository processing operations by executing them asynchronously while maintaining state through StateManager. This pattern enables responsive dashboard UI interactions even during intensive repository analysis tasks that may take significant time to complete.

## Key Functionality

This concept implements asynchronous processing with the following capabilities:

- **Non-blocking Operations**: Long-running repository analysis tasks execute in the background without blocking HTTP responses
- **State Persistence**: Processing state is maintained through StateManager, allowing operations to be tracked and resumed across sessions
- **Responsive UI**: Dashboard remains interactive during processing, providing real-time status updates
- **Process Control**: Supports pause/resume, step-by-step execution, and batch processing modes
- **Error Recovery**: Failed operations maintain state information for debugging and potential retry mechanisms

The processing workflow separates the initiation of tasks (via HTTP endpoints) from their execution, using persistent state to coordinate between the dashboard interface and background processing engines.

## Relationships

This concept integrates with several core components:

- **DashboardController**: Initiates background processes through HTTP endpoints and provides status endpoints for monitoring
- **StateManager**: Persists processing state, progress indicators, and intermediate results across application restarts
- **Processor**: Executes the actual repository analysis work in background threads or processes
- **Interactive Processing Control Pattern**: Provides granular control over background operations (pause, resume, step execution)
- **WikiManager**: Handles the output of completed background processing tasks

## Usage Example

```javascript
// Background processing is triggered through DashboardController endpoints
// The actual processing happens asynchronously while state is persisted

// Initiate background processing
const controller = new DashboardController(processor, stateManager, wikiManager);

// Start async processing - returns immediately while work continues in background
await controller.startProcessing(repositoryUrl);

// Check processing status without blocking
const status = await controller.getProcessingStatus();

// State persists across application restarts
const resumedState = stateManager.getProcessingState(repositoryId);
```

## Testing

No automated tests found for this concept.