---
title: Multi-Project Wiki Architecture
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-Project Wiki Architecture

## Purpose and Overview

The Multi-Project Wiki Architecture enables a single wiki system to manage multiple independent projects through a hierarchical URL structure and project-scoped resource management. This architecture supports multi-tenancy and enables isolated testing environments while maintaining a unified controller interface.

## Key Functionality

- **Dynamic Project Discovery**: Automatically enumerates available wiki projects from the filesystem directory structure, with fallback to a default project when no projects are found
- **Project-scoped Resource Management**: Implements lazy-loaded caching of WikiManager instances per project, ensuring resource isolation while maintaining efficient memory usage
- **Hierarchical Request Routing**: Routes requests from the new `/wiki/:project/:page` URL structure to appropriate project-specific resources
- **Configurable Base Path**: Supports configurable base paths for different deployment scenarios and testing environments

## Relationships

The Multi-Project Wiki Architecture serves as the foundation layer that connects to:

- **WikiManager instances**: Each project maintains its own WikiManager instance for isolated resource management
- **Dashboard Controller**: Acts as the primary routing layer that delegates requests to project-specific resources
- **Filesystem**: Integrates with directory structure for automatic project discovery
- **URL routing system**: Transforms the traditional flat wiki structure into a hierarchical multi-project namespace

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Controller automatically discovers projects from filesystem
const controller = new DashboardController(basePath);

// URLs now follow hierarchical structure:
// /wiki/project1/HomePage -> routes to project1's HomePage
// /wiki/project2/Documentation -> routes to project2's Documentation

// Project-specific WikiManager instances are created lazily
const projectManager = controller.getProjectManager('project1');
```

## Testing

No automated tests found for this architecture. The multi-project design specifically enables E2E testing with isolated project environments, but test coverage should be implemented to verify project discovery, resource isolation, and request routing functionality.