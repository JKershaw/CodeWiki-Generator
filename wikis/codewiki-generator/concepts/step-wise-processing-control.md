---
title: Step-wise processing control
category: concept
sourceFile: lib/dashboard-controller.js
related: [components/dashboard-controller.md]
created: 2025-11-23
updated: 2025-11-23
---

# Step-wise Processing Control

## Purpose and Overview

The Step-wise processing control provides granular management capabilities for wiki generation processes through a web dashboard interface. It enables users to control repository processing at different levels - from single commits to full batch operations - allowing for debugging, cost management, and precise control over the wiki generation workflow.

## Key Functionality

The `DashboardController` class serves as the primary interface for processing control, offering:

- **Processing Management**: Start, pause, and monitor wiki generation processes with real-time status updates
- **Granular Control**: Process individual commits or specified batch sizes for debugging and incremental progress
- **Web Interface**: Renders dashboard views and serves generated wiki pages through HTTP endpoints
- **API Endpoints**: Provides JSON responses for status monitoring and programmatic control
- **URL Validation**: Validates GitHub repository URLs before processing begins

The controller supports both automated batch processing for efficiency and step-by-step processing for careful monitoring and debugging scenarios.

## Relationships

The Step-wise processing control acts as an orchestration layer that coordinates multiple core components:

- **Processor**: Manages the actual repository analysis and wiki generation logic
- **StateManager**: Tracks processing state, progress, and current position in commit history
- **WikiManager**: Handles wiki page generation and content management
- **Web Interface Layer**: Provides the user-facing dashboard above the core processing system

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Initialize dashboard controller
const dashboard = new [DashboardController](../components/dashboard-controller.md)();

// Start processing a repository
await dashboard.startProcessing({
  url: 'https://github.com/user/repository'
});

// Process a single step for debugging
await dashboard.processStep();

// Process multiple commits in batch
await dashboard.processBatch({ count: 10 });

// Check current status
const status = await dashboard.getStatus();
```

## Testing

No automated tests found for this component. Testing coverage should be implemented to verify processing control flows, state management, and error handling scenarios.