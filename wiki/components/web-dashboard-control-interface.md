---
title: Web dashboard control interface
category: component
sourceFile: lib/dashboard-controller.js
related: [components/dashboard-controller.md]
created: 2025-11-23
updated: 2025-11-23
---

# Web Dashboard Control Interface

## Purpose and Overview

The `DashboardController` provides a web-based interface and HTTP API for controlling the wiki generation process. It allows users to start, pause, and monitor repository processing through a browser interface, with granular controls for step-by-step processing and batch operations.

## Key Functionality

The dashboard controller offers comprehensive control over the wiki generation pipeline:

- **Web Interface**: Renders a dashboard view showing current processing state and controls
- **Processing Control**: Start, pause, and monitor repository processing with real-time status updates
- **Granular Processing**: Execute single commit processing steps for debugging and cost management
- **Batch Operations**: Process specified numbers of commits in controlled batches
- **Wiki Serving**: Serves generated wiki pages through the web interface
- **Input Validation**: Validates GitHub repository URLs before processing

The controller provides both HTML views for human users and JSON API endpoints for programmatic access. It maintains processing state and integrates background execution with user controls.

## Relationships

The `DashboardController` serves as the orchestration layer that connects:

- **Processor**: Controls the core repository processing engine
- **StateManager**: Manages and persists processing state across operations
- **WikiManager**: Handles wiki page generation and serving
- **Web Layer**: Provides HTTP endpoints and renders user interface views

It acts as the primary integration point between the user interface and the underlying processing components, translating user actions into system operations.

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Initialize controller with required dependencies
const controller = new [DashboardController](../components/dashboard-controller.md)({
  processor: processorInstance,
  stateManager: stateManagerInstance,
  wikiManager: wikiManagerInstance
});

// Get current processing status
const status = await controller.getStatus();

// Start processing a repository
await controller.startProcessing('https://github.com/owner/repo');

// Process single step for debugging
await controller.processStep();

// Process batch of commits
await controller.processBatch(5);
```

## Testing

No automated tests found for this component.