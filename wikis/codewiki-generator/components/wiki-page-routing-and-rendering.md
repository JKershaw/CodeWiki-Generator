---
title: Wiki Page Routing and Rendering
category: component
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Page Routing and Rendering

## Purpose and Overview

The `DashboardController` provides an HTTP interface for managing wiki generation from repository analysis and serving the generated documentation pages. It orchestrates the processing pipeline, maintains processing state across requests, and exposes wiki pages through URL-based routing. This component bridges user interactions with the underlying repository analysis and wiki generation systems.

## Key Functionality

### Dashboard Control and Monitoring

The controller manages the complete lifecycle of wiki generation:

- **Dashboard Rendering** (`renderDashboard`): Displays the main control interface showing current processing state and available actions
- **Status Polling** (`getStatus`): Returns JSON-formatted processing state for real-time status updates
- **Processing Initiation** (`startProcessing`): Validates GitHub repository URLs and begins background processing with duplicate prevention
- **State Management** (`pauseProcessing`): Pauses active processing by updating persisted state without terminating execution

### Incremental Processing

The controller supports fine-grained control over repository analysis:

- **Step Processing** (`processStep`): Processes a single commit incrementally
- **Batch Processing** (`processBatch`): Processes multiple commits in a single operation

### Wiki Page Access

- **Wiki Page Routing** (`renderWikiPage`): Converts URL paths to wiki page files and renders generated markdown documentation

### Utility Functions

- **URL Validation** (`isValidGitHubUrl`): Ensures GitHub repository URLs meet format requirements before processing begins
- **Default State** (`getDefaultState`): Provides initial state structure for new processing sessions

## Relationships

The `DashboardController` acts as the HTTP adapter layer connecting external requests to core processing systems:

- **Processor**: Delegates repository analysis operations
- **StateManager**: Persists and retrieves processing progress across HTTP requests, enabling pause/resume functionality
- **WikiManager**: Accesses and serves generated wiki pages
- **Background Task Handling**: Decouples HTTP responses from long-running repository processing to prevent request timeouts while maintaining state consistency

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');
const controller = new DashboardController(processor, stateManager, wikiManager);

// Get current processing status
const status = controller.getStatus();

// Start processing a repository
controller.startProcessing('https://github.com/user/repo');

// Render a specific wiki page
const wikiContent = controller.renderWikiPage('/pages/architecture');

// Pause current processing
controller.pauseProcessing();

// Process a single commit
controller.processStep();
```

## Testing

No automated tests are currently available for this component. Consider adding test coverage for:
- URL validation logic and edge cases
- State transitions between processing states
- Background task error handling
- Wiki page routing and file path resolution