---
title: Multi-project infrastructure
category: concept
sourceFile: server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-project Infrastructure

## Purpose and Overview

The multi-project infrastructure provides architectural support for managing multiple projects within the E2E testing system. This enables project isolation and parallel processing capabilities, allowing teams to organize and execute tests across different project contexts simultaneously.

## Key Functionality

The infrastructure extends the existing server API with project management capabilities through dedicated endpoints:

- **Project Listing**: The `listProjects` function serves as an API endpoint handler that returns available projects for dashboard consumption
- **Project Isolation**: Enables separate test execution contexts for different projects
- **Dashboard Integration**: Provides project-aware operations through the web interface

The system maintains project boundaries while leveraging the existing testing framework, ensuring that multiple projects can coexist without interference.

## Relationships

- **Extends Dashboard API Pattern**: Builds upon the existing API endpoint structure used for status and processing operations
- **Integrates with Test Processing**: Works alongside existing processing endpoints to provide project-aware test execution
- **Supports Dashboard Interface**: Supplies project data to the frontend dashboard for project selection and management

The multi-project support is designed as an extension layer that enhances rather than replaces existing functionality.

## Usage Example

```javascript
// API endpoint for retrieving available projects
app.get('/api/projects', listProjects);

// The listProjects handler returns project data for dashboard consumption
// Projects can then be selected and managed through the dashboard interface
```

## Testing

**Test Coverage**: tests/integration/server.test.js
- 11 test cases across 6 test suites
- Covers Express Server, Health Check, Static File Serving, View Engine, Error Handling, and Middleware Configuration
- Integration tests ensure the server infrastructure properly supports multi-project operations