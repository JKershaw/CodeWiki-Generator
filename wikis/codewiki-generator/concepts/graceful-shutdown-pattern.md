---
title: Graceful Shutdown Pattern
category: concept
sourceFile: server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Graceful Shutdown Pattern

## Purpose and Overview

The graceful shutdown pattern implemented in `server.js` ensures that the Express server terminates cleanly when receiving termination signals, preventing resource leaks and data loss during deployment transitions. This pattern captures the `SIGTERM` signal and closes all active connections before the process exits, allowing in-flight requests to complete safely. It's essential for production environments and container orchestration systems where controlled shutdown is critical.

## Key Functionality

The graceful shutdown mechanism works through process signal handling:

- **Signal Listening**: Registers a listener for the `SIGTERM` signal, which is sent by container orchestrators (Docker, Kubernetes) and deployment systems during controlled shutdowns
- **Connection Closure**: Calls the server's `close()` method, which stops accepting new connections while allowing existing requests to finish processing
- **Safe Process Termination**: Ensures the process exits cleanly only after all resources are properly released, preventing orphaned connections or incomplete transactions
- **Logging**: Logs shutdown events to facilitate monitoring and debugging in production environments

When triggered, the handler closes the HTTP server without abruptly dropping client connections, ensuring graceful degradation during deployment transitions.

## Relationships

- **Express Server Foundation**: Works in conjunction with the Express server instance (`app`) and `server` object defined in the same file
- **Environment Configuration**: Respects `NODE_ENV` settings to alter shutdown behavior across deployment contexts (development vs. production)
- **Monitoring Integration**: Complements the `/health` endpoint, which allows orchestrators to detect service status during shutdown sequences
- **Middleware Pipeline**: Operates at the process level, independent of route-specific or request-level middleware, ensuring it executes regardless of application state

## Usage Example

```javascript
// In server.js - the graceful shutdown pattern is automatically initialized
// when the server starts

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Register SIGTERM signal handler for graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
```

**Shutdown Flow During Deployment:**

1. Orchestrator sends `SIGTERM` to the process
2. Signal handler logs the shutdown event
3. `server.close()` stops accepting new connections
4. Existing requests are allowed to complete
5. Process exits cleanly with code 0

## Testing

Test coverage is provided by `tests/integration/server.test.js` with 11 test cases across 6 suites:

- **Express Server**: Validates server initialization and configuration
- **Error Handling**: Confirms proper error middleware behavior
- **Middleware Configuration**: Tests the middleware pipeline setup
- **Static File Serving**: Verifies asset loading from `/public`
- **View Engine**: Confirms EJS template rendering capability
- **Health Check**: Validates the `/health` endpoint response

The test suite ensures the graceful shutdown pattern does not interfere with normal server operations and that all middleware and handlers function correctly throughout the server lifecycle.