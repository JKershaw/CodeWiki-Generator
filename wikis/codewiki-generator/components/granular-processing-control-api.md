---
title: Granular Processing Control API
category: component
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Granular Processing Control API

## Purpose and Overview

The `DashboardController` manages HTTP endpoints for wiki generation operations, providing fine-grained control over background repository processing. It bridges the web interface with the processing pipeline, enabling users to start, pause, resume, and monitor wiki generation through both automatic batch operations and manual step-by-step processing.

## Key Functionality

The controller exposes the following capabilities:

- **Dashboard Rendering** (`renderDashboard`) - Displays the main UI with current processing state and version information
- **Status Monitoring** (`getStatus`) - Returns JSON endpoint with real-time processing status
- **Batch Processing** (`startProcessing`) - Initiates background repository processing with URL validation and duplicate operation prevention
- **Step-by-Step Processing** (`processStep`, `processBatch`) - Allows manual, checkpoint-based wiki generation by processing individual commits or configurable batches
- **Pause Control** (`pauseProcessing`) - Transitions processing to a paused state while persisting state for later resumption
- **Wiki Page Serving** (`renderWikiPage`) - Converts generated wiki pages into HTML responses

### State Management

Processing state (idle, processing, paused) is persisted through `StateManager`, enabling the system to recover processing context across HTTP requests and server restarts. This architecture supports long-running, interruptible background tasks without blocking the HTTP server.

### Validation and Error Handling

The controller implements multi-layer validation:
- GitHub URL format checking via `isValidGitHubUrl`
- Required field validation for input requests
- State precondition checks before transitions (e.g., only pause when processing)
- Consistent JSON error response formatting

## Relationships

| Component | Role |
|-----------|------|
| **Processor** | Executes repository processing operations |
| **StateManager** | Persists and retrieves processing state across requests |
| **WikiManager** | Serves generated wiki pages |
| **currentProcessing Promise** | Tracks background task lifecycle |

The controller coordinates state transitions across HTTP requests, managing the flow from idle → processing → paused states.

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');
const stateManager = require('./lib/state-manager');
const processor = require('./lib/processor');
const wikiManager = require('./lib/wiki-manager');

const controller = new DashboardController({
  stateManager,
  processor,
  wikiManager
});

// Render dashboard UI
app.get('/', (req, res) => {
  const html = controller.renderDashboard();
  res.send(html);
});

// Get processing status
app.get('/api/status', (req, res) => {
  const status = controller.getStatus();
  res.json(status);
});

// Start background processing
app.post('/api/start', (req, res) => {
  const result = controller.startProcessing(req.body.repositoryUrl);
  res.json(result);
});

// Pause processing
app.post('/api/pause', (req, res) => {
  const result = controller.pauseProcessing();
  res.json(result);
});

// Process single commit
app.post('/api/process-step', (req, res) => {
  const result = controller.processStep();
  res.json(result);
});
```

## Testing

No automated tests are currently available. Consider adding test coverage for:
- URL validation edge cases
- State transition validation
- Error response formatting
- Background task lifecycle management