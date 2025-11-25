---
title: Interactive Processing Control Pattern
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Interactive Processing Control Pattern

## Purpose and Overview

The Interactive Processing Control Pattern enables granular control over long-running repository analysis operations through pause/resume, step-by-step, and batch processing modes. This pattern decouples user interaction from processing execution, allowing users to monitor and control wiki generation workflows rather than being locked into all-or-nothing operations.

## Key Functionality

- **Multi-mode Processing Control**: Supports pause/resume, step-by-step execution, and batch processing modes for repository analysis workflows
- **Granular Operation Management**: Allows users to control long-running operations with fine-grained control over execution flow
- **State-aware Processing**: Maintains processing state across user interactions, enabling resumption of paused operations
- **Interactive Workflow Management**: Provides real-time control over wiki generation processes without requiring complete restart of interrupted operations

The pattern works by maintaining processing state independently of user interface interactions, allowing background operations to be controlled through discrete commands while preserving progress and intermediate results.

## Relationships

This pattern is implemented within the **Web Dashboard Control Layer** through the DashboardController, which coordinates between:

- **Processor**: Executes the actual repository analysis operations under pattern control
- **StateManager**: Persists processing state and progress information across interactive sessions  
- **WikiManager**: Handles wiki content generation and retrieval based on processing results
- **Request Validation and Error Handling**: Ensures processing control commands are valid before execution
- **Background Processing with State Persistence**: Manages asynchronous execution while maintaining interactive control

## Usage Example

```javascript
// Interactive processing control through dashboard endpoints
// Pause current processing operation
const pauseResponse = await fetch('/api/pause', { method: 'POST' });

// Resume paused operation  
const resumeResponse = await fetch('/api/resume', { method: 'POST' });

// Execute single step of processing
const stepResponse = await fetch('/api/step', { method: 'POST' });

// Start batch processing with control parameters
const batchResponse = await fetch('/api/batch', {
  method: 'POST',
  body: JSON.stringify({ mode: 'controlled', batchSize: 10 })
});
```

## Testing

No automated tests found for this pattern implementation.