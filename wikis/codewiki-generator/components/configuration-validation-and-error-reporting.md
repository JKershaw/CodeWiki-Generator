---
title: Configuration validation and error reporting
category: component
sourceFile: lib/config.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Configuration Validation and Error Reporting

## Purpose and Overview

The configuration validation system in `lib/config.js` ensures that the application starts with valid settings by checking environment variables against defined constraints and reporting errors clearly. This prevents invalid configurations (such as missing API keys in production or invalid port numbers) from causing runtime failures, enabling early detection of setup issues before the application runs.

## Key Functionality

The `Config` class provides centralized configuration management with the following capabilities:

- **Environment Variable Loading**: Reads configuration from environment variables with sensible defaults for optional settings
- **Test Mode Detection**: Identifies whether the application runs in test mode via the `TEST_MODE` environment variable or `NODE_ENV=test`
- **Validation**: The `validate()` method checks all configuration constraints and returns a structured result containing validation status and detailed error messages
- **API Usage Decisions**: The `shouldUseRealAPIs()` method determines whether actual API calls should be made based on test mode status and API key availability
- **Production Safety**: Enforces requirements like API keys for production environments and validates ranges for numeric settings (e.g., port numbers, cost limits)

## Relationships

- **API Gatekeeper**: The Config module controls whether real API calls to services like the Anthropic API or GitHub are made, preventing unauthorized API usage in test environments
- **Test Mode Propagation**: The test mode setting influences behavior across cost control strategies and API mocking approaches throughout the application
- **Early Validation**: Validation errors are caught at startup before the application initializes, preventing cascading failures from invalid configuration

## Usage Example

```javascript
const Config = require('./lib/config');

// Create configuration instance
const config = new Config();

// Validate configuration
const validationResult = config.validate();

if (!validationResult.isValid) {
  console.error('Configuration errors:', validationResult.errors);
  process.exit(1);
}

// Check if running in test mode
if (config.isTestMode()) {
  console.log('Running in test mode - APIs will be mocked');
}

// Decide whether to use real APIs
if (config.shouldUseRealAPIs()) {
  // Make real API calls
} else {
  // Use mock implementations
}
```

## Testing

No automated tests are currently available for this component. When adding tests, focus on:

- Validation logic for each configuration constraint
- Test mode detection across different environment variable combinations
- API usage decision logic under various configuration states
- Error message clarity and completeness for invalid configurations