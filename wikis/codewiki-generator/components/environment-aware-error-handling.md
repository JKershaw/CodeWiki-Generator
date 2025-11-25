---
title: Environment-Aware Error Handling
category: component
sourceFile: server.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Environment-Aware Error Handling

## Purpose and Overview

Environment-Aware Error Handling differentiates error responses based on the NODE_ENV environment setting, exposing detailed error information during development while maintaining security in production environments. This component ensures that sensitive error details are not leaked to end users in production while providing developers with the debugging information they need.

## Key Functionality

The error handling mechanism operates as Express middleware that:

- **Development Mode**: Exposes full error details including stack traces, error messages, and debugging information to aid in development and troubleshooting
- **Production Mode**: Returns sanitized error responses that hide sensitive implementation details while still providing meaningful feedback to users
- **Environment Detection**: Automatically detects the NODE_ENV setting to determine the appropriate error response format
- **Middleware Integration**: Functions as part of the Express middleware pipeline to catch and process errors from any part of the application

The handler distinguishes between different error types and applies appropriate formatting and filtering based on the current environment context.

## Relationships

This component integrates with several other server architecture elements:

- **Request/Response Middleware Pipeline**: Functions as the final error-handling layer in the Express middleware stack
- **Express Server Architecture**: Provides centralized error processing for the entire dashboard application
- **Health Check Endpoint**: May handle errors originating from health monitoring requests
- **Static File Serving**: Processes errors that occur during static asset delivery

## Usage Example

```javascript
const express = require('express');
const app = express();

// Environment-aware error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    // Development: expose full error details
    res.status(err.status || 500).json({
      error: err.message,
      stack: err.stack
    });
  } else {
    // Production: sanitized error response
    res.status(err.status || 500).json({
      error: 'Internal Server Error'
    });
  }
});
```

## Testing

**Test Coverage**: tests/integration/server.test.js
- 11 test cases across 6 test suites
- Includes dedicated Error Handling test suite
- Tests cover both development and production error response scenarios
- Validates proper error message filtering and status code handling