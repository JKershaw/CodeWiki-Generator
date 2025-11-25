---
title: Dashboard-Centric Web Interface
category: concept
sourceFile: server.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Dashboard-Centric Web Interface

## Purpose and Overview

The Dashboard-Centric Web Interface represents a Phase 4 milestone that transforms the application from API-only to a web-first architecture. It provides a visual dashboard for monitoring and controlling batch processing workflows through a centralized web interface accessible at the root route (/).

## Key Functionality

- **Web Dashboard Controller**: Implements a DashboardController that serves as the central handler for all dashboard operations, following a controller-based routing pattern that separates business logic from Express route definitions
- **Process Control Integration**: Exposes REST endpoints for start, pause, step, and batch processing operations, enabling interactive workflow management through the web interface
- **Documentation Routing**: Provides a wildcard `/wiki` route handler that supports nested paths for documentation pages, routing GET requests to `renderWikiPage` while allowing other HTTP methods to pass through
- **Static Asset Management**: Serves dashboard assets and handles view rendering for the web interface

## Relationships

- **DashboardController**: Acts as the primary interface between the Express server and dashboard business logic
- **Process Control API**: Integrates with batch processing components to provide lifecycle management through web endpoints
- **Wiki Documentation System**: Connects to the documentation rendering system through nested route handling
- **Express Server**: Built on top of the existing Express infrastructure with middleware configuration for error handling, static file serving, and view engine setup

## Usage Example

```javascript
// Server setup with dashboard-centric routing
const express = require('express');
const DashboardController = require('./controllers/DashboardController');

const app = express();
const dashboardController = new DashboardController();

// Dashboard root route
app.get('/', dashboardController.renderDashboard);

// Process control endpoints
app.post('/api/start', dashboardController.startProcess);
app.post('/api/pause', dashboardController.pauseProcess);
app.post('/api/step', dashboardController.stepProcess);

// Wiki documentation with nested paths
app.get('/wiki/*', dashboardController.renderWikiPage);
```

## Testing

**Test Coverage**: tests/integration/server.test.js
- 11 test cases across 6 test suites
- Covers Express Server functionality, Health Check endpoints, Static File Serving, View Engine configuration, Error Handling, and Middleware Configuration
- Provides comprehensive integration testing for the web interface infrastructure