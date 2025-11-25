---
title: Graceful degradation with empty fallback
category: concept
sourceFile: lib/agents/guide-generation-agent.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Graceful Degradation with Empty Fallback

## Purpose and Overview

This architectural pattern enables the guide generation agent to continue functioning even when LLM responses are malformed or unparseable. Instead of throwing errors that could crash the system, the agent gracefully degrades by returning empty guide arrays, maintaining system stability while logging diagnostic information for debugging.

## Key Functionality

The graceful degradation system implements multiple layers of defensive handling:

- **Multi-stage validation**: Performs empty response checks, cleaned response validation, structure validation, and per-guide filtering
- **Defensive JSON parsing**: Attempts JSON repair and validates the repair succeeded before proceeding with multi-stage JSON parsing robustness
- **Filtering invalid data**: Changes from throwing errors on individual invalid guides to filtering them out and returning only valid ones, allowing partial success when some guides are malformed
- **Contextual error logging**: Captures response length and content previews (first/last 500 characters) for debugging without exposing full responses
- **Fallback return values**: Returns empty arrays instead of throwing exceptions when all parsing attempts fail

The system processes LLM responses through cascading validation layers, with each failure triggering the next defensive measure. If all repair and parsing attempts fail, it logs comprehensive error context and returns an empty guides array to allow the application to continue running.

## Relationships

This pattern is implemented within the guide generation agent and connects to several system components:

- **Multi-stage JSON parsing robustness**: Provides the underlying parsing resilience that enables graceful degradation
- **Filtering invalid data instead of rejecting**: Works in conjunction to ensure partial success scenarios
- **Contextual error logging for debugging**: Supplies diagnostic information when degradation occurs
- **LLM Response Processing**: Handles unpredictable output formats from language model responses
- **Downstream Components**: Provides consistent empty array responses that dependent systems can safely process

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

// Agent automatically applies graceful degradation
const agent = new GuideGenerationAgent();
const guides = await agent.generateGuides(prompt);

// Always returns an array, even if LLM response is malformed
// guides = [] when parsing fails
// guides = [validGuides...] when parsing succeeds or partially succeeds
```

## Testing

No automated tests found for this component.