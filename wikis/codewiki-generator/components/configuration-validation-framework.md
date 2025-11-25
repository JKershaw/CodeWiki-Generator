---
title: Configuration validation framework
category: component
sourceFile: lib/config.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Configuration Validation Framework

## Purpose and Overview

The configuration validation framework provides systematic validation of application settings loaded from environment variables at startup. It establishes environment-driven configuration with critical separation between test and production modes, enabling mock-based testing while maintaining strict validation and cost controls in production environments.

## Key Functionality

- **Environment-based configuration loading** - Loads application settings from environment variables with distinct handling for test vs production modes
- **Startup validation** - Performs comprehensive validation of configuration values including:
  - Range checks (e.g., port numbers)
  - Required field validation in production environments
  - Business logic constraints for costs and frequencies
- **Structured error reporting** - Returns detailed validation errors for graceful failure handling
- **Cost and rate controls** - Configures guardrails through `MAX_DAILY_COST` and `META_ANALYSIS_FREQUENCY` to prevent runaway API usage costs
- **Test mode separation** - Allows operation without real API credentials in test environments while maintaining production validation requirements

## Relationships

- **Application startup** - Called during application initialization to validate configuration before services start
- **External API services** - Provides validated credentials and cost controls for expensive external API integrations
- **Testing framework** - Enables test execution without production credentials through environment mode detection
- **Error handling system** - Integrates with application error handling through structured validation error reporting

## Usage Example

```javascript
const config = require('./lib/config');

// Configuration is validated automatically on require
// Access validated configuration values
const port = config.PORT;
const maxCost = config.MAX_DAILY_COST;
const apiKey = config.API_KEY; // Required in production, optional in test

// Configuration validation errors are thrown at startup if validation fails
console.log(`Server starting on port ${port} with daily cost limit ${maxCost}`);
```

## Testing

No automated tests found for this component. The framework supports testing through environment mode separation, allowing test execution without production API credentials.