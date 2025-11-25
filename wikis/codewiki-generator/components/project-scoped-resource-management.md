---
title: Project-scoped Resource Management
category: component
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Project-scoped Resource Management

## Purpose and Overview

Project-scoped Resource Management implements lazy-loaded caching of WikiManager instances per project within a multi-project wiki architecture. This component enables efficient resource isolation while maintaining a single controller interface, allowing the system to manage multiple wiki projects with isolated environments through a unified dashboard controller.

## Key Functionality

- **Lazy-loaded Caching**: Creates and caches WikiManager instances on-demand for each project, optimizing memory usage by only instantiating resources when needed
- **Resource Isolation**: Maintains separate WikiManager instances per project, ensuring complete isolation between different wiki projects
- **Dynamic Request Routing**: Routes incoming requests to the appropriate project-specific resources based on the project identifier extracted from the request
- **Single Controller Interface**: Provides a unified entry point for all project operations while managing the complexity of multi-project resource distribution internally

## Relationships

This component is a core part of the **Multi-Project Wiki Architecture** and works closely with:
- **Dynamic Project Discovery**: Relies on project enumeration to determine which projects need resource management
- **Project-aware Request Routing**: Receives routed requests with project identifiers and directs them to the appropriate cached resources
- **WikiManager instances**: Manages the lifecycle and caching of these project-specific resource managers
- **Dashboard Controller**: Operates within the dashboard controller (`lib/dashboard-controller.js`) to provide seamless multi-project functionality

## Usage Example

```javascript
// The component operates within the dashboard controller
// Project-specific resources are accessed through cached WikiManager instances
const dashboardController = require('./lib/dashboard-controller');

// Requests are automatically routed to project-scoped resources
// URL pattern: /wiki/:project/:page
// The controller handles resource management transparently
app.get('/wiki/:project/*', dashboardController.handleProjectRequest);
```

## Testing

No automated tests are currently available for this component. Testing coverage should be implemented to verify proper resource isolation, caching behavior, and request routing functionality.