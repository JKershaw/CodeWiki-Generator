---
title: Graceful Shutdown with Signal Handling
category: guide
sourceFile: server.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Graceful Shutdown with Signal Handling

## Purpose and Overview

Implements SIGTERM signal handling for clean server termination, essential for containerized deployments and zero-downtime restarts. This pattern ensures the Express server can gracefully close all connections and complete pending requests before shutting down.

## Key Functionality

The graceful shutdown mechanism listens for SIGTERM signals from the operating system and orchestrates a clean termination process:

- **Signal Registration**: Registers a handler for SIGTERM signals using `process.on('SIGTERM')`
- **Connection Cleanup**: Closes the HTTP server and waits for existing connections to complete
- **Resource Cleanup**: Provides opportunity to close database connections, clear timers, and clean up other resources
- **Process Termination**: Exits the process cleanly after all cleanup operations complete

This is particularly critical in containerized environments where orchestration platforms like Kubernetes send SIGTERM signals before forcefully killing containers.

## Relationships

- **Express Server Architecture**: Works in conjunction with the main Express server instance to enable controlled shutdown
- **Health Check Endpoint**: Health checks may fail or return different status during shutdown process
- **Request/Response Middleware Pipeline**: Ensures in-flight requests can complete before server terminates
- **Environment-Aware Error Handling**: May log different shutdown messages based on NODE_ENV settings

## Usage Example

```javascript
// Basic graceful shutdown implementation
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const server = app.listen(port);
```

## Testing

**Test Coverage**: tests/integration/server.test.js
- 11 test cases across 6 test suites
- Test categories include Express Server, Health Check, Static File Serving, View Engine, Error Handling, and Middleware Configuration
- Integration tests validate server startup, shutdown behavior, and signal handling functionality