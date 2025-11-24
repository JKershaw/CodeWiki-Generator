---
title: Singleton configuration module
category: component
sourceFile: lib/config.js
related: [meta/overview.md]
created: 2025-11-24
updated: 2025-11-24
---

# Singleton Configuration Module

## Purpose and [Overview](../meta/overview.md)

The singleton configuration module provides centralized configuration management for the application, loading environment variables with sensible defaults and maintaining consistent configuration state throughout the codebase. It includes built-in validation and test mode detection to enable flexible development workflows without requiring API keys in test environments.

## Key Functionality

- **Environment Variable Loading**: Reads configuration from environment variables with fallback defaults
- **Test Mode Detection**: Automatically detects test environments and allows mock usage without API credentials
- **Configuration Validation**: Implements structured validation that returns both validity status and detailed error messages
- **Singleton Pattern**: Exports a single shared instance to ensure consistent configuration across all modules
- **Graceful Error Handling**: Provides clear error messaging for configuration issues before runtime failures occur

## Relationships

- **Application Entry Point**: Imported by main application files to access configuration settings
- **Service Modules**: Used by API clients, database connections, and other services that require configuration
- **Test Suites**: Leveraged by testing frameworks to enable mock configurations and test-specific settings
- **Environment Systems**: Integrates with deployment environments through environment variable mapping

## Usage Example

```javascript
const config = require('./lib/config');

// Access configuration values
const apiUrl = config.apiUrl;
const dbConnectionString = config.database.connectionString;

// Check if running in test mode
if (config.isTestMode) {
  // Use mock services
}

// Validate configuration before startup
const validation = config.validate();
if (!validation.isValid) {
  console.error('Configuration error:', validation.errors);
  process.exit(1);
}
```

## Testing

No automated tests found for this component. Testing coverage should be added to verify configuration loading, validation logic, and test mode detection functionality.