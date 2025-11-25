---
title: Dynamic Project Discovery
category: component
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Dynamic Project Discovery

## Purpose and Overview

Dynamic Project Discovery enables the wiki system to automatically identify and enumerate available wiki projects from the filesystem directory structure. This component provides the foundation for multi-project support by scanning the configured base path and discovering project directories without requiring manual configuration changes.

## Key Functionality

The Dynamic Project Discovery component performs filesystem-based enumeration of wiki projects with intelligent fallback mechanisms:

- **Automatic Project Detection**: Scans the configured base directory to identify available wiki project folders
- **Fallback Strategy**: Provides graceful degradation to a default project when no projects are discovered or when filesystem access fails
- **Runtime Discovery**: Projects can be added or removed from the filesystem and will be automatically detected without code changes
- **Integration with Resource Management**: Works seamlessly with the project-scoped resource management system to ensure discovered projects have appropriate WikiManager instances

The discovery process runs dynamically, allowing the wiki system to adapt to changing project structures without requiring application restarts or configuration updates.

## Relationships

Dynamic Project Discovery serves as a foundational component in the multi-project wiki architecture:

- **Enables Multi-Project Wiki Architecture**: Provides the project enumeration capability that makes multi-project support possible
- **Feeds Project-scoped Resource Management**: Discovered projects are used to create and cache WikiManager instances on-demand
- **Supports Project-aware Request Routing**: The list of discovered projects validates incoming requests and determines valid project routes
- **Integrates with Dashboard Controller**: Works within `lib/dashboard-controller.js` to provide project information for routing and resource allocation decisions

## Usage Example

Based on the code analysis indicating filesystem-based discovery integrated into the dashboard controller:

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Controller automatically discovers projects during initialization
const controller = new DashboardController(basePath);

// Projects are discovered from filesystem and available for routing
// Discovery happens transparently when handling requests like:
// GET /wiki/:project/:page
```

## Testing

No automated tests found for this component. Testing coverage should include filesystem discovery scenarios, fallback behavior, and integration with the broader multi-project architecture.