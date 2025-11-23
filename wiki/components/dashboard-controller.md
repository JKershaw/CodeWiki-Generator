---
title: DashboardController
category: component
sourceFile: Not specified
related: []
created: 2025-11-23
updated: 2025-11-23
---

# DashboardController

## Purpose and Overview

The DashboardController transforms the application from a CLI tool into a full-stack web application by providing a comprehensive web dashboard interface. It serves as the central controller for real-time system monitoring, manual process control, and dynamic wiki content management through a unified web interface.

## Key Functionality

The DashboardController provides several core capabilities:

- **Dashboard Interface**: Renders the main web dashboard at the root path for system overview and controls
- **Status Monitoring**: Exposes real-time system status through API endpoints for live dashboard updates
- **Process Control**: Provides manual control over processing operations including start, pause, single-step, and batch processing
- **Dynamic Wiki Routing**: Handles arbitrary nested wiki paths using flexible middleware, enabling content organization without hardcoded routes
- **Web API Integration**: Transforms existing processing logic into web-accessible endpoints for remote management

The controller uses a RESTful API design pattern, separating rendering endpoints from control APIs to support both human users and programmatic access.

## Relationships

The DashboardController integrates deeply with the existing application architecture:

- **Express Server Enhancement**: Builds upon the basic Express server setup, extending it from simple health checks to a full web application
- **Processing Logic Integration**: Connects with existing processing components to provide web-based control over automated workflows
- **Wiki Management**: Complements static file serving with dynamic wiki content rendering and nested path resolution
- **Real-time Communication**: Likely coordinates with WebSocket or polling mechanisms for live status updates in the dashboard interface

## Usage Example

```javascript
const express = require('express');
const DashboardController = require('./controllers/DashboardController');

const app = express();
const dashboard = new DashboardController();

// Set up dashboard routes
app.get('/', dashboard.renderDashboard);
app.get('/api/status', dashboard.getStatus);
app.post('/api/start', dashboard.startProcessing);
app.post('/api/pause', dashboard.pauseProcessing);
app.post('/api/step', dashboard.processStep);
app.post('/api/batch', dashboard.processBatch);

// Dynamic wiki routing
app.get('/wiki/*', dashboard.renderWikiPage);

app.listen(3000, () => {
  console.log('Dashboard available at http://localhost:3000');
});
```

## Testing

No automated tests are currently available for the DashboardController. Testing should cover API endpoint responses, wiki routing functionality, and integration with underlying processing components.