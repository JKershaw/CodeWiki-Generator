---
title: DashboardController
category: component
sourceFile: server.js
related: [components/wiki-integration.md]
created: 2025-11-23
updated: 2025-11-23
---

# DashboardController

## Purpose and Overview

The DashboardController is the primary web interface controller that transforms the application from CLI-only to web-accessible. It provides a centralized dashboard for system monitoring and control, enabling users to manage processing operations through a browser interface.

## Key Functionality

The DashboardController handles all dashboard-related HTTP routes and business logic through several key capabilities:

**Web Interface Management**
- Renders the main dashboard interface at the root path
- Provides real-time system status through API endpoints
- Serves as the primary entry point for web-based operations

**Processing Control**
- **Start/Pause Operations**: Initiates and pauses processing operations via web interface
- **Step Processing**: Executes single processing steps for granular control
- **Batch Processing**: Handles multiple items in batch mode for efficient bulk operations

**[Wiki Integration](../components/wiki-integration.md)**
- Renders wiki pages through nested URL patterns (e.g., `/wiki/concepts/architecture`)
- Integrates documentation viewing directly within the dashboard interface
- Provides seamless navigation between operational controls and documentation

## Relationships

The DashboardController connects several system components:

- **Health Check Integration**: Builds upon existing health check endpoints to provide system status
- **Wiki System**: Connects the documentation viewing system with the dashboard interface
- **CLI Functionality**: Provides web access to processing operations previously only available through command line
- **Static File Serving**: Works with Express middleware for serving dashboard assets and views

## Usage Example

```javascript
// Dashboard controller handles Express routes
app.get('/', dashboardController.renderDashboard);
app.get('/status', dashboardController.getStatus);
app.post('/start', dashboardController.startProcessing);
app.post('/pause', dashboardController.pauseProcessing);
app.post('/step', dashboardController.processStep);
app.post('/batch', dashboardController.processBatch);
app.get('/wiki/*', dashboardController.renderWikiPage);
```

## Testing

**Test Coverage**: `tests/integration/server.test.js`
- 11 test cases across 6 test suites
- **Test Categories**: Express Server, Health Check, Static File Serving, View Engine, Error Handling, Middleware Configuration
- Comprehensive integration testing ensures dashboard functionality works correctly with the Express server infrastructure