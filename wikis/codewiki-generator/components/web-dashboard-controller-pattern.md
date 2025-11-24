---
title: Web Dashboard Controller Pattern
category: component
sourceFile: server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Web Dashboard Controller Pattern

## Purpose and Overview

The Web Dashboard Controller Pattern provides a centralized controller for managing the dashboard UI rendering and API endpoints in the application. It separates routing concerns from business logic, enabling a clean architecture where HTTP handlers delegate to the controller for dashboard operations, status queries, and process management. This pattern serves as the primary interface for users to interact with the system through a web-based dashboard.

## Key Functionality

The `DashboardController` class encapsulates all dashboard-related operations:

- **Dashboard Rendering** (`renderDashboard`): Generates the main dashboard HTML interface that displays the current state of the system to users
- **Status Queries** (`getStatus`): Returns the current processing status as JSON, enabling real-time dashboard updates
- **Process Control Operations**: Provides fine-grained control over processing workflows:
  - `startProcessing`: Initiates a new processing workflow
  - `pauseProcessing`: Pauses the current running workflow
  - `processStep`: Executes a single processing step for manual control
  - `processBatch`: Processes multiple items in batch mode for efficiency
- **Wiki Page Serving** (`renderWikiPage`): Renders documentation pages with support for nested wiki paths, making in-app documentation accessible through the web interface

All operations are exposed through RESTful API endpoints, allowing the frontend dashboard to request actions and receive updates through standard HTTP requests.

## Relationships

The Dashboard Controller integrates with other system components as follows:

- **Route Handlers**: Express routes delegate process control requests to corresponding controller methods, keeping handlers thin and routing logic focused on HTTP concerns
- **Status Representation**: Provides the system state information that the dashboard UI displays to users
- **Wiki Integration**: Uses middleware-based routing to intercept GET requests to wiki paths and render documentation through the controller
- **Process Orchestration**: Acts as the coordination point between user interactions on the dashboard and the underlying processing engine

## Usage Example

```javascript
// Initialize the controller
const dashboardController = new DashboardController();

// Render the dashboard view
app.get('/', (req, res) => {
  const html = dashboardController.renderDashboard();
  res.send(html);
});

// Query current status
app.get('/api/status', (req, res) => {
  const status = dashboardController.getStatus();
  res.json(status);
});

// Control processing workflow
app.post('/api/process/start', (req, res) => {
  dashboardController.startProcessing();
  res.json({ message: 'Processing started' });
});

app.post('/api/process/pause', (req, res) => {
  dashboardController.pauseProcessing();
  res.json({ message: 'Processing paused' });
});
```

## Testing

Test coverage is available in `tests/integration/server.test.js` with 11 test cases across 6 test suites, including:

- Express Server configuration
- Health Check endpoints
- Static File Serving
- View Engine setup
- Error Handling
- Middleware Configuration

These tests validate that the controller integrates correctly with the Express framework and that dashboard routes respond appropriately to requests.