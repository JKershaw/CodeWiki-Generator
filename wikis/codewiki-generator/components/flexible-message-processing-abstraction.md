---
title: Flexible message processing abstraction
category: component
sourceFile: lib/claude.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Flexible Message Processing Abstraction

## Purpose and Overview

The flexible message processing abstraction in `lib/claude.js` provides dual interfaces for interacting with the Claude API, supporting both text and JSON response formats. It automatically extracts JSON content from markdown code blocks and abstracts away protocol-specific details to improve usability across different use cases.

## Key Functionality

This component offers two primary methods for message processing:

- **sendMessage()** - Returns the full text response from the Claude API
- **sendMessageJSON()** - Automatically extracts and parses JSON content from markdown code blocks in responses

The abstraction handles:
- Automatic JSON extraction from markdown formatting
- Protocol detail abstraction for simplified API interactions  
- Consistent interface regardless of response type expected
- Seamless integration with the broader ClaudeClient system

## Relationships

This abstraction is part of the larger ClaudeClient component and works alongside:
- **Cost-aware API client wrapper** - Tracks usage and expenses for all message operations
- **Resilient retry logic** - Provides fault tolerance for message processing calls
- **Lazy-loaded SDK initialization** - Ensures efficient resource usage during message operations

## Usage Example

```javascript
const ClaudeClient = require('./lib/claude');

// Initialize client
const claudeClient = new ClaudeClient();

// Send message and get text response
const textResponse = await claudeClient.sendMessage('Hello, Claude!');

// Send message and get parsed JSON response
const jsonData = await claudeClient.sendMessageJSON('Generate a JSON object with user data');
```

## Testing

**Test Coverage**: `tests/unit/claude.test.js`
- 29 test cases across 11 test suites
- Comprehensive coverage including sendMessage and sendMessageJSON methods
- Tests verify both text and JSON response handling
- Includes mock-based testing for reliable unit test execution