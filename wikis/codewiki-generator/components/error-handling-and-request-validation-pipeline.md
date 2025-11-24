---
title: Error Handling and Request Validation Pipeline
category: component
sourceFile: server.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Error Handling and Request Validation Pipeline

## Purpose and Overview

The Error Handling and Request Validation Pipeline provides centralized error management and request validation across all HTTP endpoints in the CodeWiki Dashboard. It ensures consistent, structured error responses and meaningful debugging information by implementing a middleware-based approach that catches undefined routes and application errors, adapting error reporting granularity based on the environment (development vs production).

## Key Functionality

### 404 Handler Middleware
Intercepts requests to undefined routes and returns a structured JSON error response. This catch-all middleware ensures that invalid endpoint requests receive consistent error formatting rather than default Express responses.

### Global Error Handler Middleware
Captures application errors thrown during request processing. The handler:
- Logs errors with appropriate verbosity based on `NODE_ENV`
- Returns full error details (stack traces, messages) in development mode
- Returns sanitized error responses in production for security
- Supports different HTTP status codes for various error types

### Request Validation Pattern
The pipeline validates incoming requests through the middleware chain before reaching route handlers. Invalid requests are rejected early with appropriate error responses, preventing invalid data from corrupting application state.

### Environment-Aware Error Reporting
Error responses adapt based on the deployment environment:
- **Development/Test**: Includes stack traces, detailed error messages, and debugging information
- **Production**: Returns minimal error details to prevent information leakage

## Relationships

- **Depends on Express middleware chain**: Integrates with Express routing and middleware system
- **Uses dotenv**: Environment configuration determines error reporting behavior
- **Works with route handlers**: Catches errors thrown from all endpoint handlers
- **Complements /health endpoint**: Health check endpoint operates independently from error pipeline
- **Supports monitoring systems**: Error responses can be parsed by monitoring and alerting tools

## Usage Example

```javascript
// In server.js - error handler is registered after all routes

// 404 handler - catches undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'The requested endpoint does not exist' 
  });
});

// Global error handler - catches application errors
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const response = process.env.NODE_ENV === 'production' 
    ? { error: 'Internal Server Error' }
    : { error: err.message, stack: err.stack };
  
  res.status(statusCode).json(response);
});
```

The pipeline processes requests in order: validation → route handling → error handlers. If a route handler throws an error, it's caught by the global error handler and returned as a structured response.

## Testing

Test coverage for error handling and the request validation pipeline is provided in `tests/integration/server.test.js`:

- **Test Coverage**: 11 test cases across 6 test suites
- **Test Categories**: 
  - Express Server configuration
  - Health Check endpoint validation
  - Static File Serving
  - View Engine setup
  - Error Handling responses
  - Middleware Configuration

Tests validate that the error pipeline correctly handles 404 requests, captures application errors, and returns appropriately formatted responses based on environment settings.