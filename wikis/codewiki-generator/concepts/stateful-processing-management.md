---
title: Stateful Processing Management
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Stateful Processing Management

## Purpose and Overview

The Dashboard Controller manages interactive control over long-running repository analysis and wiki generation through a web interface. It implements a stateful processing system that enables users to pause, resume, and step through repository processing while tracking progress across HTTP requests, preventing timeouts while maintaining fine-grained control over the documentation pipeline.

## Key Functionality

The Dashboard Controller provides the following capabilities:

**Processing Control**
- **Start Processing**: Initiates repository analysis with URL validation and duplicate prevention to avoid concurrent operations on the same repository
- **Pause Processing**: Halts active processing by updating persisted state, allowing users to pause long-running tasks
- **Step Processing**: Processes a single commit incrementally for granular control
- **Batch Processing**: Processes multiple commits in a single batch operation for efficiency

**Status and Monitoring**
- **Status Polling**: Returns current processing state as JSON, enabling real-time dashboard updates
- **Dashboard Rendering**: Displays the main dashboard view with current processing state

**Wiki Access**
- **Page Routing and Rendering**: Maps URL paths to generated wiki markdown files and renders documentation pages

**State Management**
- Maintains persistent state across HTTP requests through the StateManager
- Provides default state structure when no persisted state exists
- Tracks processing progress, pause status, and completion state

**Background Task Processing**
- Decouples HTTP responses from long-running operations using background promises
- Contains errors in background tasks to prevent crashes while maintaining user feedback
- Prevents request timeouts on resource-intensive repository analysis

## Relationships

The Dashboard Controller acts as an HTTP adapter layer between web requests and the core processing pipeline:

- **Depends on Processor**: Executes repository analysis operations (commit processing, repository cloning)
- **Depends on StateManager**: Persists processing progress and control state across requests
- **Depends on WikiManager**: Provides access to generated wiki pages for rendering
- **Acts as HTTP Adapter**: Translates web requests into processing commands and formats responses

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

const controller = new DashboardController(processorInstance, stateManager, wikiManager);

// Start processing a repository
await controller.startProcessing('https://github.com/user/repo');

// Poll for status updates
const status = controller.getStatus();
console.log(status); // { paused: false, progress: 42, total: 100 }

// Pause active processing
controller.pauseProcessing();

// Process next single commit
await controller.processStep();

// Render dashboard view
const dashboardHtml = controller.renderDashboard();

// Render a specific wiki page
const wikiPage = controller.renderWikiPage('getting-started');
```

## Testing

No automated tests are currently available. Test coverage for this component should focus on:
- URL validation and duplicate prevention in `startProcessing`
- State persistence across pause/resume cycles
- Background task error containment
- Wiki page routing and file access patterns