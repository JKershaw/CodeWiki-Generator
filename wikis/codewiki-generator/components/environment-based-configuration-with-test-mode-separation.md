---
title: Environment-based configuration with test mode separation
category: component
sourceFile: lib/config.js
related: [meta/overview.md]
created: 2025-11-24
updated: 2025-11-24
---

# Environment-based Configuration with Test Mode Separation

## Purpose and [Overview](../meta/overview.md)

Provides a centralized configuration system that loads environment variables with sensible defaults and includes explicit test mode detection. This enables flexible development and testing workflows by allowing mock usage without API keys when running in test mode.

## Key Functionality

- **Environment Variable Loading**: Loads configuration values from environment variables with fallback defaults
- **Test Mode Detection**: Explicitly identifies when running in test mode to enable different behavior patterns
- **Configuration Validation**: Implements structured validation that returns both validity status and detailed error information
- **Graceful Error Handling**: Provides clear error messaging for configuration issues before they cause runtime problems
- **Singleton Pattern**: Exports a single shared instance to ensure consistent configuration state across the application

## Relationships

- **Application Entry Points**: Used by main application modules to access environment-specific settings
- **API Clients**: Provides API keys and endpoints, with test mode allowing mock implementations
- **Testing Framework**: Integrates with test environments to enable different configuration behavior
- **Validation Components**: Works with other validation patterns in the codebase for consistent error handling

## Usage Example

```javascript
const config = require('./lib/config');

// Access configuration values
const apiKey = config.apiKey;
const environment = config.environment;

// Check test mode for conditional behavior
if (config.isTestMode()) {
  // Use mock implementations
  console.log('Running in test mode');
} else {
  // Use real API connections
  console.log('Running in production mode');
}

// Validate configuration before use
const validation = config.validate();
if (!validation.isValid) {
  console.error('Configuration error:', validation.errors);
}
```

## Testing

No automated tests found for this component.