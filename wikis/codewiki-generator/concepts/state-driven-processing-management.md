---
title: State-Driven Processing Management
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# State-Driven Processing Management

## Purpose and Overview

DashboardController serves as the HTTP request-response layer for wiki generation operations, bridging the web interface to background repository processing. It manages the complete lifecycle of long-running, interruptible processing tasks through state persistence, enabling pause/resume workflows and exposing granular control over wiki generation through a series of REST endpoints.

## Key Functionality

### Core Responsibilities

**Dashboard Rendering**
- `renderDashboard()` displays the main dashboard UI with current processing state and version information
- `renderWikiPage()` serves generated wiki pages as HTML, converting URL paths to markdown files

**Processing Orchestration**
- `startProcessing()` initiates background repository processing with URL validation and prevents duplicate concurrent operations
- `pauseProcessing()` transitions the processing state to paused, persisting state for later resumption
- `processStep()` processes a single commit incrementally from the current repository
- `processBatch()` processes N commits in a batch operation with configurable count

**Status Monitoring**
- `getStatus()` returns JSON status of the current wiki generation processing, allowing clients to monitor progress

**Input Validation**
- `isValidGitHubUrl()` validates GitHub repository URLs against expected format patterns
- Implements multi-layer validation across endpoints (URL format, required fields, state preconditions)
- Provides consistent error response formatting for client consumption

**State Management**
- `getDefaultState()` returns initial state structure for new or uninitialized processing sessions
- Coordinates state transitions (idle → processing → paused) across HTTP requests using StateManager

### Background Task Pattern

The controller spawns background processing as independent Promises (`currentProcessing`) that run without blocking HTTP responses, enabling asynchronous repository processing while maintaining immediate feedback to clients.

## Relationships

- **Processor**: Executes the actual repository processing logic
- **StateManager**: Persists and retrieves processing state across requests, enabling pause/resume capability
- **WikiManager**: Serves generated wiki pages to clients
- **currentProcessing Promise**: Internal tracking of background task lifecycle

## Usage Example

```javascript
const DashboardController = require('./dashboard-controller');
const processor = require('./processor');
const stateManager = require('./state-manager');
const wikiManager = require('./wiki-manager');

const controller = new DashboardController(processor, stateManager, wikiManager);

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

// Start processing a repository
app.post('/api/process', (req, res) => {
  const result = controller.startProcessing(req.body.repositoryUrl);
  res.json(result);
});

// Pause processing
app.post('/api/pause', (req, res) => {
  const result = controller.pauseProcessing();
  res.json(result);
});

// Process single commit
app.post('/api/step', (req, res) => {
  const result = controller.processStep();
  res.json(result);
});
```

## Testing

No automated tests are currently available. Contributions of test coverage are welcome.