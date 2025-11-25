---
title: Multi-stage JSON parsing robustness
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-stage JSON parsing robustness

## Purpose and Overview

Multi-stage JSON parsing robustness implements layered error handling for parsing API responses in the guide generation system. This component transforms brittle parsing operations into fault-tolerant processes that can handle malformed responses while maintaining system stability.

## Key Functionality

The component provides three layers of protection when parsing JSON responses:

- **Pre-parsing validation**: Validates response format and structure before attempting to parse
- **Try-catch wrapping**: Safely handles JSON parsing failures with comprehensive error capture
- **Post-parsing validation with repair**: Verifies parsed content validity and attempts to repair minor issues

When parsing fails, the system employs graceful degradation by returning an empty guides array instead of throwing errors. Invalid individual guides are filtered out rather than causing complete failure, allowing partial success when some guides are valid but others are malformed.

Contextual error logging captures diagnostic information including response length, preview chunks, and error context to provide operators visibility into parsing failure causes.

## Relationships

This component is part of the guide generation agent pipeline and connects to:

- **Guide Generation Agent**: Primary consumer that relies on robust parsing for API response handling
- **Error Logging System**: Receives detailed diagnostic information when parsing failures occur
- **System Stability Framework**: Contributes to overall fault tolerance by preventing parsing errors from cascading

## Usage Example

```javascript
// The multi-stage parsing is built into the guide generation agent
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();
// Parsing robustness is automatically applied to API responses
const guides = await agent.generateGuides(input);
// Returns valid guides array even if some parsing issues occur
```

## Testing

No automated tests found for this component. Testing should focus on malformed JSON responses, partial parsing failures, and error logging verification.