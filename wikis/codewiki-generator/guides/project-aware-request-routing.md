---
title: Project-aware Request Routing
category: guide
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Project-aware Request Routing

## Purpose and Overview

Project-aware request routing transforms the dashboard controller from handling single-project wikis to supporting multiple isolated wiki projects within a unified interface. This routing mechanism parses hierarchical URLs and dynamically directs requests to the appropriate project-specific resources, enabling multi-tenant wiki functionality.

## Key Functionality

The routing system implements several key capabilities:

- **URL Structure Transformation**: Changes from flat `/wiki/page` URLs to hierarchical `/wiki/:project/:page` format
- **Dynamic Project Resolution**: Parses incoming requests to extract project identifiers and target resources
- **Resource Delegation**: Routes authenticated requests to the correct WikiManager instance for the specified project
- **Project Isolation**: Ensures requests are contained within their designated project scope, preventing cross-project data access

The controller maintains a cache of WikiManager instances per project and lazy-loads them as requests arrive, optimizing memory usage while providing fast response times for active projects.

## Relationships

This component integrates with several other system elements:

- **Multi-Project Wiki Architecture**: Operates as the routing layer within the broader multi-project infrastructure
- **Project-scoped Resource Management**: Utilizes the cached WikiManager instances to delegate actual request processing
- **Dynamic Project Discovery**: Leverages project enumeration to validate requested projects exist before routing
- **Dashboard Controller**: Functions as the core routing logic within the main controller class

## Usage Example

```javascript
// URL routing examples handled by the dashboard controller
// Request: GET /wiki/project-a/HomePage
// Routes to: project-a WikiManager instance, requesting HomePage

// Request: GET /wiki/project-b/UserGuide  
// Routes to: project-b WikiManager instance, requesting UserGuide

// The controller internally handles the routing:
const projectId = extractProjectFromUrl(request.url);
const wikiManager = getProjectWikiManager(projectId);
const response = wikiManager.handleRequest(request);
```

## Testing

No automated tests found for this component.