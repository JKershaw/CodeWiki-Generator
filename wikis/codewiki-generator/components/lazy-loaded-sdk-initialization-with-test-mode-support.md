---
title: Lazy-loaded SDK initialization with test mode support
category: component
sourceFile: lib/claude.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Lazy-loaded SDK initialization with test mode support

## Purpose and Overview

The ClaudeClient constructor implements conditional SDK loading that defers expensive Anthropic SDK imports during test execution while maintaining full functionality in production environments. This design enables efficient testing through dependency injection patterns without sacrificing runtime performance.

## Key Functionality

The lazy loading mechanism works by:

- **Conditional Import**: Only loads the Anthropic SDK when not in test mode, avoiding unnecessary module loading overhead during test execution
- **Dependency Injection Support**: Allows external injection of mock clients through the `client` property for comprehensive testing
- **Configuration Integration**: Automatically configures the SDK with API keys from the application's configuration system when loaded
- **Transparent Operation**: Provides identical interfaces regardless of whether the real SDK or a test mock is being used

The component detects test environments and defers SDK initialization until actually needed, while supporting mock injection for isolated unit testing.

## Relationships

This component serves as the foundation for the ClaudeClient's other capabilities:

- **Cost-aware API client wrapper**: Provides the base client instance that cost tracking wraps around
- **Resilient retry logic**: Supplies the underlying client that retry mechanisms operate against  
- **Flexible message processing**: Establishes the SDK connection that message processing methods utilize
- **Configuration System**: Integrates with application config to obtain API credentials
- **Testing Framework**: Coordinates with Jest mocks to enable comprehensive unit testing

## Usage Example

```javascript
const ClaudeClient = require('./lib/claude.js');

// In production - SDK loads automatically with config
const claudeClient = new ClaudeClient();

// In tests - inject mocks for isolated testing
describe('ClaudeClient', () => {
  let claudeClient;
  let mockAnthropic;

  beforeEach(() => {
    mockAnthropic = {
      messages: {
        create: jest.fn()
      }
    };

    claudeClient = new ClaudeClient();
    claudeClient.client = mockAnthropic; // Dependency injection
  });
});
```

## Testing

**Test Coverage**: tests/unit/claude.test.js
- 29 test cases across 11 test suites
- Validates constructor initialization with API key configuration
- Confirms mock injection capabilities for isolated unit testing
- Tests integration with all major ClaudeClient functionality including messaging, cost calculation, and model support