---
title: Background Task Orchestration
category: component
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Background Task Orchestration

## Purpose and Overview

DashboardController manages HTTP endpoints for wiki generation, providing both a user interface and programmatic API for controlling long-running repository processing tasks. It bridges the web interface to the processing pipeline, enabling asynchronous repository operations while maintaining interactive control through pause/resume capabilities and persistent state management.

## Key Functionality

The controller implements several core patterns:

**HTTP Endpoint Management**
- `renderDashboard()` - Serves the main dashboard UI with current processing state
- `getStatus()` - Returns JSON status of ongoing wiki generation operations
- `renderWikiPage()` - Serves generated wiki pages as HTML

**Background Task Control**
- `startProcessing(repositoryUrl)` - Initiates background processing with URL validation and duplicate operation prevention. Returns immediately while spawning a background promise that runs independently
- `pauseProcessing()` - Transitions state to paused and persists it for later resumption
- `processStep()` - Processes a single commit incrementally
- `processBatch(count)` - Processes N commits in batch mode

**State and Validation**
- `isValidGitHubUrl(url)` - Validates GitHub repository URLs before processing
- `getDefaultState()` - Provides initial state structure for new sessions
- Multi-layer validation across URL format, required fields, and state preconditions

**Key Pattern: Promise-Based Asynchronous Processing**
The controller maintains a `currentProcessing` promise that runs independently of HTTP request/response cycles. This enables non-blocking wiki generation while allowing subsequent HTTP requests to monitor or modify processing state.

## Relationships

- **Processor** - Executes actual repository processing and commit analysis
- **StateManager** - Persists processing state (idle, processing, paused) across requests, enabling state recovery
- **WikiManager** - Serves generated wiki pages from the processing output
- **currentProcessing Promise** - Tracks the lifecycle of background processing tasks

State transitions flow through the controller: `idle` → `processing` → `paused` (or completion), with StateManager ensuring persistence across HTTP requests and server restarts.

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');
const controller = new DashboardController(processor, stateManager, wikiManager);

// Render dashboard UI
app.get('/', (req, res) => {
  const html = controller.renderDashboard();
  res.send(html);
});

// Check processing status
app.get('/api/status', (req, res) => {
  const status = controller.getStatus();
  res.json(status);
});

// Start background processing
app.post('/api/process', (req, res) => {
  const result = controller.startProcessing('https://github.com/user/repo');
  res.json(result);
});

// Pause ongoing processing
app.post('/api/pause', (req, res) => {
  const result = controller.pauseProcessing();
  res.json(result);
});
```

## Testing

No automated tests are currently available. When implementing tests, focus on:
- State transitions and persistence across HTTP requests
- URL validation and error handling consistency
- Promise lifecycle management in background processing
- Concurrent request handling during active processing