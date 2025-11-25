---
title: Environment-driven configuration with test mode separation
category: concept
sourceFile: lib/config.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Environment-driven configuration with test mode separation

## Purpose and [Overview](../meta/overview.md)

This component provides a centralized configuration system that manages application settings through environment variables while maintaining clear separation between test and production modes. It ensures safe testing without requiring real API keys and enables flexible configuration across different deployment environments.

## Key Functionality

- **Environment Variable Loading**: Reads configuration values from environment variables with appropriate defaults
- **Test Mode Separation**: Automatically detects test environments and applies different validation rules
- **Configuration Validation**: Implements comprehensive validation through a `validate()` method that:
  - Enforces port number ranges
  - Validates non-negative cost values
  - Requires API keys in production mode but allows them to be optional in test mode
  - Provides clear error messaging for invalid configurations
- **Runtime Safety**: Prevents application startup with invalid configuration, catching issues early
- **Singleton Pattern**: Exports a single shared instance ensuring consistent configuration state across the application

## Relationships

This configuration component serves as a foundational dependency for other application modules that need access to environment-specific settings. It acts as the central source of truth for:
- API integration modules (providing required API keys)
- Server initialization (port configuration)
- Cost calculation services (pricing parameters)
- Test suites (enabling mock configurations)

## Usage Example

```javascript
const config = require('./lib/config');

// Configuration is automatically loaded and validated on import
console.log(`Starting server on port ${config.port}`);

// Access environment-specific settings
if (config.isProduction) {
  // Use real API keys and production settings
  const apiClient = new APIClient(config.apiKey);
} else {
  // Use test mode configurations
  const mockClient = new MockAPIClient();
}
```

## Testing

No automated tests found for this configuration component. Testing should focus on validating environment variable parsing, test mode detection, and configuration validation rules across different deployment scenarios.