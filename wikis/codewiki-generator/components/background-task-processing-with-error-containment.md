---
title: Background Task Processing with Error Containment
category: component
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Background Task Processing with Error Containment

## Purpose and Overview

The Dashboard Controller provides an HTTP interface for managing long-running wiki generation tasks while preventing request timeouts. It decouples HTTP responses from background repository processing by initiating asynchronous operations that continue executing independently, allowing users to monitor progress through a web dashboard while maintaining consistent state across requests.

## Key Functionality

### Dashboard and Status Management

The controller renders an interactive dashboard view that displays current processing state and provides endpoints for real-time status monitoring. The `renderDashboard()` function generates the main UI, while `getStatus()` returns JSON-formatted processing state for polling-based updates.

### Processing Control

The controller implements fine-grained control over repository analysis through multiple processing modes:

- **Background Initiation** (`startProcessing`): Validates GitHub repository URLs, prevents duplicate processing, and launches background processing tasks that execute independently from the HTTP request lifecycle
- **Pause/Resume** (`pauseProcessing`): Manages persisted state to pause active processing without losing progress
- **Incremental Processing** (`processStep`, `processBatch`): Processes commits individually or in batches for granular control over analysis pace

### Error Containment

Background processing tasks include error handling that prevents failures from affecting the HTTP response or blocking subsequent requests. Errors are contained within the background operation and logged without interrupting the user experience.

### Wiki Page Serving

The `renderWikiPage()` function routes URL paths to generated wiki markdown files, converting HTTP requests into file system lookups and rendering documentation pages from the processing pipeline output.

### Input Validation

The `isValidGitHubUrl()` function validates repository URLs before processing begins, ensuring only properly formatted GitHub URLs are queued for analysis.

## Relationships

- **Processor**: Performs actual repository analysis and commit processing operations
- **StateManager**: Persists processing progress, pause state, and run metadata across HTTP requests
- **WikiManager**: Provides access to generated wiki pages for rendering through the web interface
- **HTTP Layer**: Acts as the adapter between web requests and the core processing pipeline

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');
const controller = new DashboardController(processor, stateManager, wikiManager);

// Render dashboard view
app.get('/dashboard', (req, res) => {
  const html = controller.renderDashboard();
  res.send(html);
});

// Get current processing status
app.get('/api/status', (req, res) => {
  const status = controller.getStatus();
  res.json(status);
});

// Start background processing
app.post('/api/start', (req, res) => {
  const url = req.body.repositoryUrl;
  controller.startProcessing(url);
  res.json({ message: 'Processing started' });
});

// Render wiki page
app.get('/wiki/:page', (req, res) => {
  const html = controller.renderWikiPage(req.params.page);
  res.send(html);
});
```

## Testing

No automated test coverage is currently available. When writing tests, verify that:
- Background processing tasks complete without blocking HTTP responses
- Errors in background operations are contained and logged
- State persistence maintains consistency across multiple requests
- URL validation correctly rejects malformed repository URLs
- Wiki page routing maps paths to files accurately