---
title: Project Listing API Endpoint
category: component
sourceFile: server.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Project Listing API Endpoint

## Purpose and Overview

The Project Listing API Endpoint is a REST endpoint that provides enumeration capabilities for multiple test projects within the E2E testing system. It enables the dashboard UI to discover and display available projects, supporting the architectural transition from single-project to multi-project infrastructure.

## Key Functionality

- Exposes a REST API endpoint for retrieving available projects
- Integrates with the Multi-Project Infrastructure to enumerate project instances
- Provides JSON response format suitable for dashboard consumption
- Handles project discovery and metadata retrieval
- Supports the broader multi-project management capabilities of the testing system

## Relationships

- **Multi-Project Infrastructure**: Relies on the underlying multi-project architecture to discover and enumerate available test projects
- **Dashboard UI**: Serves as the primary data source for project selection and management interfaces
- **Express Server**: Implemented as part of the main server application routing layer
- **Testing System**: Enables project-level organization and management of E2E test suites

## Usage Example

```javascript
// HTTP GET request to retrieve project listing
fetch('/api/projects')
  .then(response => response.json())
  .then(projects => {
    console.log('Available projects:', projects);
  });
```

## Testing

**Test Coverage**: tests/integration/server.test.js
- 11 test cases across 6 test suites
- Coverage includes Express Server, Health Check, Static File Serving, View Engine, Error Handling, and Middleware Configuration
- Integration testing ensures endpoint availability within the broader server infrastructure