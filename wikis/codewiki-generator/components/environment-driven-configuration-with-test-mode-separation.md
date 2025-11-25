---
title: Environment-driven configuration with test mode separation
category: component
sourceFile: lib/config.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Environment-driven Configuration with Test Mode Separation

## Purpose and Overview

This component provides centralized application configuration management that adapts based on the runtime environment. It enables seamless switching between test mode (using mocks) and production mode (requiring real credentials) while enforcing cost controls and operational guardrails for external API usage.

## Key Functionality

The configuration system loads settings from environment variables and applies different validation rules based on the current environment:

- **Environment Detection**: Automatically detects test vs production environments and adjusts validation requirements accordingly
- **Selective Validation**: In test mode, API credentials are optional to support mock-based testing; in production, they become required fields
- **Cost Controls**: Enforces configurable limits through `MAX_DAILY_COST` to prevent runaway API expenses
- **Rate Limiting**: Controls processing frequency via `META_ANALYSIS_FREQUENCY` to manage API call rates
- **Startup Validation**: Performs comprehensive validation at application startup including range checks for ports, required field verification, and business logic constraints
- **Structured Error Reporting**: Returns detailed validation errors for graceful failure handling

## Relationships

This configuration component serves as the foundation for other system components that require:
- API credentials for external service integration
- Cost and rate limiting parameters for budget-conscious operations
- Environment-specific behavior switching between test and production modes
- Server configuration settings like port numbers

## Usage Example

```javascript
const config = require('./lib/config');

// Configuration is automatically loaded from environment variables
// In production, all API credentials must be present
// In test mode, credentials are optional for mock usage

const serverPort = config.PORT;
const maxCost = config.MAX_DAILY_COST;
const analysisFreq = config.META_ANALYSIS_FREQUENCY;
```

## Testing

No automated tests found. The configuration validation logic would benefit from unit tests covering different environment scenarios and validation edge cases.