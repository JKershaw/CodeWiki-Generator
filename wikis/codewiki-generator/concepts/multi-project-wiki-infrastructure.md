---
title: Multi-project wiki infrastructure
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-project wiki infrastructure

## Purpose and Overview

The multi-project wiki infrastructure enables the codebase wiki system to support multiple projects within a single workspace through project-specific routing, caching, and directory organization. This architectural enhancement moves the system from single-wiki limitations to a scalable multi-project environment with dedicated WikiManager instances per project.

## Key Functionality

The infrastructure provides several core capabilities:

- **Project-specific WikiManager caching**: Maintains cached WikiManager instances per project to avoid recreation overhead
- **Dynamic project discovery**: Scans the filesystem to automatically detect available wiki projects in the base directory
- **Project-aware routing**: Supports URL patterns like `/wiki/:project/:page` for accessing project-specific content
- **API endpoints**: Provides `/projects` endpoint to list available projects with proper formatting
- **Fallback handling**: Uses a default project when no specific project is specified in requests

The system centers around a `wikisBasePath` directory structure where each subdirectory represents a separate project, with WikiManager instances cached in memory for efficient reuse.

## Relationships

- **Extends WikiManager usage**: Builds upon existing WikiManager functionality with project-specific instances
- **Modifies URL routing**: Integrates with the routing system to handle project namespaces in wiki URLs
- **Dashboard integration**: Connects with dashboard rendering to display project selection interfaces
- **Filesystem integration**: Relies on directory scanning to discover and manage multiple project locations

## Usage Example

```javascript
// Get WikiManager for specific project
const projectManager = getProjectWikiManager('my-project');

// Discover available projects
const projects = await getAvailableProjects();

// API endpoint usage for project listing
app.get('/projects', listProjects);
```

## Testing

No automated tests are currently available for this component. Test coverage would benefit from scenarios covering project discovery, WikiManager caching behavior, and project-specific routing patterns.