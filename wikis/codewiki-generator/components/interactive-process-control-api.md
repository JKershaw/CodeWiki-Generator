---
title: Interactive Process Control API
category: component
sourceFile: server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Interactive Process Control API

## Purpose and Overview

The Interactive Process Control API provides RESTful endpoints that enable users to control and monitor processing workflows through a web dashboard. This component centralizes dashboard rendering and process orchestration, allowing interactive control over execution through start, pause, step, and batch operations. It serves as the primary interface between the frontend dashboard and backend processing logic.

## Key Functionality

### Dashboard Rendering
- `renderDashboard()` - Renders the main dashboard HTML interface for users to interact with the system
- `renderWikiPage()` - Serves nested wiki documentation pages with support for dynamic path routing

### Process Status and Monitoring
- `getStatus()` - Returns current processing status as JSON, enabling real-time dashboard updates about the system state

### Process Control Operations
- `startProcessing()` - Initiates a new processing workflow
- `pauseProcessing()` - Pauses the current processing workflow
- `processStep()` - Executes a single processing step, useful for step-through debugging and controlled execution
- `processBatch()` - Processes multiple items in batch mode for bulk operations

### Architecture Pattern

The **DashboardController** class encapsulates all dashboard-related operations, implementing a controller pattern that separates concerns between route handling and business logic. This centralized approach ensures consistent handling of dashboard requests and maintains a single source of truth for process control operations.

## Relationships

- **DashboardController** encapsulates all dashboard and wiki rendering functionality
- **Process Control Endpoints** delegate to DashboardController methods for executing workflow operations
- **Wiki Integration** uses middleware-based routing to intercept documentation requests and serve pages
- **Dashboard UI** provides visual representation of system status and exposes process control capabilities to end users
- Coordinates with processing workflow components to execute start, pause, and step operations

## Usage Example

```javascript
const DashboardController = require('./path/to/dashboardController');

// Initialize the controller
const dashboardController = new DashboardController();

// Render the main dashboard
app.get('/', (req, res) => {
  const dashboardHTML = dashboardController.renderDashboard();
  res.send(dashboardHTML);
});

// Get current system status
app.get('/api/status', (req, res) => {
  const status = dashboardController.getStatus();
  res.json(status);
});

// Control process operations
app.post('/api/process/start', (req, res) => {
  dashboardController.startProcessing();
  res.json({ message: 'Processing started' });
});

app.post('/api/process/pause', (req, res) => {
  dashboardController.pauseProcessing();
  res.json({ message: 'Processing paused' });
});

app.post('/api/process/step', (req, res) => {
  dashboardController.processStep();
  res.json({ message: 'Step executed' });
});
```

## Testing

Test coverage is provided in `tests/integration/server.test.js` with 11 test cases across 6 test suites covering:
- Express server configuration
- Health check endpoints
- Static file serving
- View engine setup
- Error handling
- Middleware configuration

These tests validate the server's routing behavior, middleware execution, and integration with the dashboard controller.