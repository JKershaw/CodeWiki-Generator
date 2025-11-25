---
title: Web Dashboard Controller Architecture
category: component
sourceFile: server.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Web Dashboard Controller Architecture

## Purpose and Overview

The Web Dashboard Controller Architecture establishes a controller-based routing pattern that separates business logic from Express route definitions, with DashboardController serving as the central handler for all dashboard operations. This architecture shifts the application from API-only to a web-first interface with a dashboard root route, representing a Phase 4 milestone for visual monitoring and control of batch processing workflows.

## Key Functionality

- **Centralized Dashboard Control**: DashboardController handles all dashboard-related operations through a clean separation of concerns
- **Process Control API**: Exposes endpoints for start, pause, step, and batch processing operations that enable interactive workflow management
- **Nested Wiki Documentation**: Implements wildcard `/wiki` route handling that supports nested documentation paths using middleware
- **Web-First Architecture**: Provides a dashboard root route (`/`) that serves as the primary interface for batch processing workflow visualization

The controller architecture uses middleware to route GET requests to appropriate handlers while allowing other HTTP methods to pass through, creating a flexible routing system for both dashboard and documentation pages.

## Relationships

- **Express Server Integration**: Built on top of Express.js with view engine configuration and static file serving
- **Batch Processing Workflows**: Provides web interface controls for batch job lifecycle management
- **Documentation System**: Connects to wiki documentation through nested routing patterns
- **Health Check System**: Integrates with application health monitoring endpoints

## Usage Example

```javascript
// Basic server setup with dashboard controller
const express = require('express');
const app = express();

// Dashboard controller handles root route
app.get('/', DashboardController.renderDashboard);

// Process control endpoints
app.post('/start', DashboardController.startProcess);
app.post('/pause', DashboardController.pauseProcess);
app.post('/step', DashboardController.stepProcess);

// Nested wiki documentation routing
app.use('/wiki/*', (req, res, next) => {
  if (req.method === 'GET') {
    DashboardController.renderWikiPage(req, res);
  } else {
    next();
  }
});
```

## Testing

**Test Coverage**: Comprehensive integration testing in `tests/integration/server.test.js`
- **11 test cases** across **6 test suites**
- **Test Categories**: Express Server setup, Health Check endpoints, Static File Serving, View Engine configuration, Error Handling, and Middleware Configuration
- Integration tests verify the complete server setup and routing functionality