---
title: Resilient JSON Response Parsing
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Resilient JSON Response Parsing

## Purpose and Overview

The Resilient JSON Response Parsing component provides robust handling of JSON responses from Claude API calls by automatically cleaning markdown formatting that can interfere with JSON parsing. This addresses the common issue where Large Language Models wrap JSON responses in code blocks, making direct parsing impossible.

## Key Functionality

The component implements a `_cleanJSON` method that preprocesses raw API responses before JSON parsing by:

- Removing markdown code block wrappers (both `\`\`\`json` and generic `\`\`\``)
- Stripping surrounding whitespace that could cause parsing errors
- Handling multiple markdown wrapper formats commonly used by LLMs
- Providing a clean JSON string ready for `JSON.parse()`

This preprocessing step runs before any JSON parsing attempts, ensuring that responses wrapped in markdown formatting are properly handled without throwing parsing exceptions.

## Relationships

This component is integrated within the Guide Generation Agent (`lib/agents/guide-generation-agent.js`) and serves as a utility layer between:

- **Claude API responses** - Receives raw text responses that may contain markdown-wrapped JSON
- **JSON parsing operations** - Provides cleaned JSON strings for standard `JSON.parse()` calls
- **Agent response processing** - Enables reliable extraction of structured data from LLM responses

The component acts as a preprocessing filter in the response handling pipeline, making the overall agent more resilient to variations in LLM output formatting.

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

// Inside the agent, responses are automatically cleaned before parsing
const rawResponse = '```json\n{"status": "success", "data": {...}}\n```';
const cleanedJson = this._cleanJSON(rawResponse);
const parsedData = JSON.parse(cleanedJson);
```

## Testing

No automated tests found for this component. Testing coverage should be added to verify proper handling of various markdown wrapper formats and edge cases in JSON cleaning.