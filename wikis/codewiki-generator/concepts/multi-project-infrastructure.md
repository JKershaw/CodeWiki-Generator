---
title: Multi-Project Infrastructure
category: concept
sourceFile: server.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-Project Infrastructure

## Purpose and Overview

The Multi-Project Infrastructure introduces a project-level abstraction layer to the E2E testing system, enabling management and coordination of multiple independent test projects within a single server instance. This represents a foundational architectural shift from single-project to multi-project support, allowing teams to organize and isolate their testing efforts across different applications or environments.

## Key Functionality

- **Project Management**: Provides the core infrastructure to handle multiple test projects simultaneously, each with their own configuration and test suites
- **Project Enumeration**: Exposes a REST API endpoint that allows clients to discover and list available projects in the system
- **Dashboard Integration**: Enables the UI dashboard to display and manage multiple projects through standardized API endpoints
- **Resource Isolation**: Maintains separation between different projects while sharing common server infrastructure

## Relationships

The Multi-Project Infrastructure serves as a foundational layer that connects to:

- **Dashboard UI**: Provides project data to enable multi-project selection and management interfaces
- **Test Execution System**: Coordinates test runs across different projects with proper isolation
- **Configuration Management**: Manages project-specific settings and parameters
- **API Layer**: Exposes project operations through REST endpoints for external integration

## Usage Example

```javascript
// Access the project listing endpoint
const response = await fetch('/api/projects');
const projects = await response.json();

// Projects array contains available test projects
projects.forEach(project => {
  console.log(`Project: ${project.name}, Status: ${project.status}`);
});
```

## Testing

**Test Coverage**: `tests/integration/server.test.js`
- 11 test cases across 6 test suites
- Covers Express Server functionality, Health Check endpoints, Static File Serving, View Engine configuration, Error Handling, and Middleware Configuration
- Validates the server infrastructure that supports the multi-project architecture