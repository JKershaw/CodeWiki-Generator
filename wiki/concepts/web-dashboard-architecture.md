---
title: Web Dashboard Architecture
category: concept
sourceFile: Not specified
related: [components/nested-wiki-routing.md, components/dashboard-controller.md]
created: 2025-11-23
updated: 2025-11-23
---

# Web Dashboard Architecture

## Purpose and Overview

The Web Dashboard Architecture provides a comprehensive web-based control interface that transforms the application from a CLI tool into a full-stack web application. It enables real-time monitoring of processing status and manual control over documentation generation workflows through an intuitive dashboard interface.

## Key Functionality

- **Real-time Status Monitoring**: The `DashboardController` provides API endpoints for live system status updates, allowing users to monitor processing state, progress, and system health
- **Process Control**: Offers manual control over automated workflows with endpoints for starting, pausing, single-step processing, and batch operations
- **Dynamic Wiki Rendering**: Implements [nested wiki routing](../components/nested-wiki-routing.md) that handles arbitrary URL paths using middleware, enabling flexible content organization without hardcoded routes
- **Dashboard Interface**: Serves the main dashboard UI at the root path with integrated controls for all system operations
- **API Integration**: Provides RESTful endpoints (`/api/status`, `/api/start`, `/api/pause`, `/api/step`, `/api/batch`) for programmatic access to all dashboard functionality

The controller acts as the central hub connecting the web interface with the underlying processing engine, providing both human-friendly UI and machine-readable APIs.

## Relationships

- Integrates with the existing Express server infrastructure to extend basic health checks into a full web application
- Connects to the core processing logic through API endpoints, allowing dashboard controls to trigger actual workflow operations
- Complements static file serving with dynamic wiki content rendering, creating a unified documentation viewing experience
- Works alongside the documentation generation system to provide real-time feedback and manual override capabilities

## Usage Example

```javascript
const DashboardController = require('./controllers/DashboardController');
const express = require('express');

const app = express();
const dashboard = new [DashboardController](../components/dashboard-controller.md)();

// Set up dashboard routes
app.get('/', dashboard.renderDashboard);
app.get('/api/status', dashboard.getStatus);
app.post('/api/start', dashboard.startProcessing);
app.post('/api/pause', dashboard.pauseProcessing);
app.post('/api/step', dashboard.processStep);
app.post('/api/batch', dashboard.processBatch);

// Dynamic wiki routing
app.get('/wiki/*', dashboard.renderWikiPage);
```

## Testing

No automated tests are currently available for this component. Testing should focus on API endpoint responses, dashboard rendering functionality, wiki routing behavior, and integration with the underlying processing system.