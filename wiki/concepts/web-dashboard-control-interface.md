---
title: Web Dashboard Control Interface
category: concept
sourceFile: Not specified
related: [components/dashboard-controller.md]
created: 2025-11-23
updated: 2025-11-23
---

# Web Dashboard Control Interface

## Purpose and Overview

The Web Dashboard Control Interface provides an HTTP-based control layer for the wiki generation system, enabling users to manage repository processing workflows through a web UI. It serves as the presentation layer that bridges web requests with the core wiki generation pipeline, offering both interactive dashboard views and REST API endpoints for programmatic control.

## Key Functionality

**Dashboard Management**
- Renders a web-based dashboard showing current processing state and system version
- Provides real-time status updates via JSON API endpoints
- Displays processing progress, errors, and completion statistics

**Processing Control**
- Validates GitHub repository URLs and initiates processing workflows
- Prevents concurrent processing through state management
- Offers multiple processing modes: continuous, step-by-step, and batch processing
- Supports pause/resume functionality for long-running operations

**Wiki Page Serving**
- Serves generated wiki pages with proper path resolution
- Handles metadata and content delivery for the generated documentation
- Integrates with the WikiManager for content retrieval

## Relationships

The [DashboardController](../components/dashboard-controller.md) orchestrates three core components: the Processor (handles repository analysis), StateManager (tracks processing state), and WikiManager (generates wiki content). It extends the existing processing system by adding web-based control capabilities without modifying the underlying architecture. The controller implements the presentation layer for the multi-phase processing system, translating HTTP requests into appropriate method calls on the coordinated components.

## Usage Example

```javascript
const DashboardController = require('./dashboard-controller');

// Initialize the dashboard controller
const dashboard = new [DashboardController](../components/dashboard-controller.md)({
  processor: processorInstance,
  stateManager: stateManagerInstance,
  wikiManager: wikiManagerInstance
});

// Start processing a repository
await dashboard.startProcessing({
  body: { repoUrl: 'https://github.com/owner/repo' }
}, response);

// Check processing status
const status = await dashboard.getStatus();
console.log(status.state); // 'processing', 'paused', 'completed', etc.

// Process a single step
await dashboard.processStep({}, response);
```

## Testing

No automated tests are currently available for this component. Test coverage should be implemented to verify HTTP endpoint functionality, state management, and integration with core processing components.