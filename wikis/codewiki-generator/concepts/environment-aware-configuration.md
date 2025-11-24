---
title: Environment-aware Configuration
category: concept
sourceFile: server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Environment-aware Configuration

## Purpose and Overview

The `server.js` file establishes the HTTP server foundation for the dashboard application, configuring Express middleware, routes, and operational behavior based on the execution environment. It implements environment-aware configuration patterns that adapt server behavior (port selection, error handling verbosity, startup behavior) across development and test environments, enabling flexible deployment across different stages of the application lifecycle.

## Key Functionality

### Server Initialization
- Creates an Express application instance with configured middleware pipeline
- Reads port configuration from environment variables (`PORT`) with a fallback default of 3000
- Uses `dotenv` to load environment-specific settings from `.env` files
- Respects `NODE_ENV` to determine operational mode (development, test, production)

### Observability
- Provides a `/health` endpoint that returns server status, timestamp, and version metadata
- Enables monitoring systems and container orchestrators to verify service availability and readiness

### Middleware Pipeline
- Configures EJS as the view rendering engine
- Serves static assets from the `/public` directory
- Implements a 404 handler that catches undefined routes and returns structured error responses
- Implements a global error handler that logs errors and returns HTTP 500 responses with environment-aware detail levels (verbose in development, minimal in production)

### Graceful Shutdown
- Handles `SIGTERM` process signals to cleanly close server connections
- Prevents resource leaks and ensures safe deployment transitions during container restarts or orchestration updates

## Relationships

- **Depends on `dotenv`**: Loads environment variables from `.env` configuration files
- **Depends on Express**: Uses Express as the HTTP server framework
- **Depends on EJS**: Uses EJS templating engine for server-side view rendering
- **Exports app module**: The Express application instance is exported for use in testing frameworks and integration tests
- **Expects directory structure**: Requires `/views` directory for EJS templates and `/public` directory for static assets

## Usage Example

```javascript
const app = require('./server');

// In test environment (NODE_ENV === 'test')
// The app is available for integration testing without starting the server
// Example: pass to supertest for HTTP assertions
const request = require('supertest');
const response = await request(app).get('/health');

// In production/development
// The server starts automatically and listens on configured PORT
// PORT defaults to 3000 if not specified in environment variables
```

## Configuration

Set environment variables to customize behavior:

```bash
PORT=8080              # Server port (default: 3000)
NODE_ENV=development   # Environment mode: development, test, or production
```

The error handler adapts its output based on `NODE_ENV`:
- **Development/Test**: Returns full error stack traces for debugging
- **Production**: Returns minimal error information to avoid exposing sensitive details

## Testing

**Test Coverage**: `tests/integration/server.test.js`
- **11 test cases** across 6 test suites
- **Test categories**: Express Server, Health Check, Static File Serving, View Engine, Error Handling, Middleware Configuration

The test suite verifies:
- Server initialization and middleware configuration
- Health endpoint functionality and response format
- Static file serving from `/public` directory
- EJS view engine configuration
- 404 and error handler behavior
- Proper middleware execution order