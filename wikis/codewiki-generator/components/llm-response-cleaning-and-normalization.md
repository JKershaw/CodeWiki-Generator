---
title: LLM Response Cleaning and Normalization
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# LLM Response Cleaning and Normalization

## Purpose and [Overview](../meta/overview.md)

The LLM Response Cleaning and Normalization component addresses the critical robustness issue where Claude's JSON responses may be wrapped in markdown code blocks. This defensive programming pattern ensures reliable JSON parsing by normalizing various response formats before validation, which is essential for production LLM integrations.

## Key Functionality

The component implements a preprocessing pipeline that cleans LLM responses before JSON parsing through the `_cleanJSON` method:

- **Format Normalization**: Removes markdown code block wrappers (```json, ```) from responses
- **Plain JSON Handling**: Processes responses that are already in plain JSON format
- **Defensive Parsing**: Prevents parse failures by standardizing input format before validation
- **Response Sanitization**: Ensures consistent JSON structure regardless of LLM output formatting

This preprocessing step runs before JSON parsing in the agent's response handling pipeline, reducing parse failures and improving overall agent reliability.

## Relationships

This component is integrated into the Guide Generation Agent's response processing workflow:

- **Parent Component**: `lib/agents/guide-generation-agent.js` - Contains the cleaning logic as part of the agent's response handling
- **Processing Pipeline**: Acts as an intermediary step between raw LLM response and JSON validation
- **Error Prevention**: Works in conjunction with JSON parsing to create a more resilient agent architecture

## Usage Example

```javascript
// Internal usage within guide-generation-agent.js
// The _cleanJSON method processes responses before parsing
const cleanedResponse = this._cleanJSON(rawLLMResponse);
const parsedJSON = JSON.parse(cleanedResponse);
```

Note: This is an internal component method. The cleaning happens automatically within the agent's response processing pipeline and is not directly exposed for external use.

## Testing

No automated tests found for this component. Consider adding test coverage for various response formats including markdown-wrapped JSON, plain JSON, and edge cases to ensure robust handling of different LLM output patterns.