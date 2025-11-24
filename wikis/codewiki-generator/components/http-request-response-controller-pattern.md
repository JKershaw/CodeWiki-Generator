---
title: HTTP Request-Response Controller Pattern
category: component
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# HTTP Request-Response Controller Pattern

## Purpose and Overview

The `DashboardController` serves as the HTTP control layer for the wiki generation system, managing the web interface and providing API endpoints for monitoring and controlling repository processing. It bridges the user-facing dashboard UI with the underlying processing pipeline, coordinating state management and asynchronous background tasks to enable both automated and manual wiki generation workflows.

## Key Functionality

### Dashboard Rendering and Status Monitoring
- **`renderDashboard()`** - Renders the main dashboard view with current processing state and version information, providing real-time visibility into the system status
- **`getStatus()`** - Exposes processing state as a JSON API endpoint, allowing clients to poll current progress without page reloads

### Processing Control
- **`startProcessing(repositoryUrl)`** - Initiates background wiki generation with URL validation and duplicate-request prevention. Spawns a long-running Promise that executes independently while returning immediate HTTP responses
- **`pauseProcessing()`** - Transitions the processing state to paused and persists it, enabling pause/resume workflows across HTTP requests
- **`processStep()`** - Processes a single commit incrementally from the current repository, enabling checkpoint-based manual control
- **`processBatch(count)`** - Processes N commits in batch, allowing configurable throughput control

### Wiki Page Serving
- **`renderWikiPage(path)`** - Serves generated wiki pages as HTML by converting URL paths to corresponding markdown files

### Validation and State Management
- **`isValidGitHubUrl(url)`** - Validates GitHub repository URLs against expected format patterns
- **`getDefaultState()`** - Returns the initial state structure for new or uninitialized processing sessions

## Relationships

| Component | Relationship | Purpose |
|-----------|-------------|---------|
| **Processor** | Dependency | Executes repository processing operations |
| **StateManager** | Dependency | Persists and retrieves processing state across requests |
| **WikiManager** | Dependency | Serves generated wiki pages |
| **currentProcessing Promise** | Internal lifecycle management | Tracks background task execution and prevents concurrent processing |

The controller coordinates state transitions (`idle` → `processing` → `paused`) across multiple HTTP requests, maintaining consistency through StateManager persistence.

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Initialize controller with dependencies
const controller = new DashboardController({
  processor: processorInstance,
  stateManager: stateManagerInstance,
  wikiManager: wikiManagerInstance
});

// Render dashboard in HTTP GET handler
app.get('/dashboard', (req, res) => {
  const html = controller.renderDashboard();
  res.send(html);
});

// Start background processing
app.post('/api/process', (req, res) => {
  const result = controller.startProcessing('https://github.com/user/repo');
  res.json(result);
});

// Get current processing status
app.get('/api/status', (req, res) => {
  const status = controller.getStatus();
  res.json(status);
});

// Pause ongoing processing
app.post('/api/pause', (req, res) => {
  const result = controller.pauseProcessing();
  res.json(result);
});
```

## Testing

No automated tests are currently available for this component. Contributors should verify controller behavior through:
- Manual endpoint testing via HTTP requests
- State persistence validation across pause/resume cycles
- Background task lifecycle verification
- Input validation and error response consistency