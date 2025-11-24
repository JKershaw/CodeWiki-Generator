---
title: Environment-driven configuration with test mode separation
category: concept
sourceFile: lib/config.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Environment-driven Configuration with Test Mode Separation

## Purpose and Overview

The Config module provides centralized management of application settings through environment variables while maintaining a separate test mode for development and testing without requiring real API credentials. This component acts as the gatekeeper for API usage decisions and enables the application to operate safely across production and non-production environments.

## Key Functionality

The Config class loads and manages application configuration with the following capabilities:

- **Environment variable loading**: Reads configuration from environment variables with sensible defaults for optional settings
- **Test mode detection**: Identifies when the application runs in test mode via `TEST_MODE` environment variable or `NODE_ENV=test`
- **API usage decisions**: Determines whether real API calls should be made based on test mode status and available credentials
- **Configuration validation**: Validates all settings including API key requirements for production, port ranges, and cost limits, returning structured error reports
- **Helper methods**: Provides `isTestMode()` and `shouldUseRealAPIs()` for other components to conditionally execute API-dependent code

## Relationships

The Config module functions as a critical control point in the application architecture:

- **API gatekeeper**: Controls whether the Anthropic API and GitHub Token are used for real requests or mocked responses
- **Cost control integration**: Works with cost limiting strategies by validating cost limit configurations
- **System-wide influence**: Test mode setting cascades across multiple components to adjust behavior appropriately
- **Early validation**: Prevents invalid configurations from causing runtime failures by validating before application startup

## Usage Example

```javascript
const Config = require('./lib/config');

const config = new Config();

// Check if running in test mode
if (config.isTestMode()) {
  console.log('Running in test mode - APIs will be mocked');
}

// Decide whether to use real APIs
if (config.shouldUseRealAPIs()) {
  // Make real API calls to Anthropic, GitHub, etc.
  callRealAPI();
} else {
  // Use mock implementations
  callMockedAPI();
}

// Validate configuration before starting application
const validation = config.validate();
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
  process.exit(1);
}
```

## Testing

No automated tests are currently available for this module. When implementing tests, ensure coverage includes:

- Environment variable loading and default value behavior
- Test mode detection under various NODE_ENV and TEST_MODE combinations
- API usage decision logic based on mode and credential availability
- Validation of required fields in production mode
- Validation error messages and structured reporting