---
title: Resilient JSON Parsing from LLM Responses
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Resilient JSON Parsing from LLM Responses

## Purpose and Overview

This component implements defensive parsing strategies to handle common malformations in Claude API responses before JSON validation. LLM outputs frequently contain markdown formatting wrappers, unescaped newlines, or incompletely formed JSON structures. The `_cleanJSON` method repairs these inconsistencies automatically, ensuring reliable JSON parsing in production environments without manual intervention.

## Key Functionality

The `_cleanJSON` private method performs preprocessing operations on LLM responses:

- **Markdown removal**: Strips markdown code block delimiters (`` ```json `` and `` ``` ``) that Claude commonly adds to JSON responses
- **Content extraction**: Identifies and extracts valid JSON structures from wrapped or padded content
- **Heuristic repairs**: Applies intelligent fixes for common malformations including:
  - Unescaped newlines within JSON strings
  - Unterminated string values
  - Unclosed array and object brackets
- **Validation**: Attempts parsing after each cleaning step to verify structural integrity

This defensive approach gracefully handles imperfectly formatted responses, improving robustness of LLM-based agent interactions without requiring manual intervention.

## Relationships

- **Used by**: `GuideGenerationAgent` class during Claude API response processing
- **Integration point**: Functions as a resilience layer between API responses and downstream JSON parsing
- **Pattern**: Supports agent-based LLM interactions by normalizing varied output formats before validation
- **Scope**: Operates internally within all guide generation workflows that depend on structured JSON responses

## Usage Example

The `_cleanJSON` method is called automatically within the agent's response processing pipeline. When using `GuideGenerationAgent`, cleaning happens transparently:

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent(config);

// Claude's response is automatically cleaned before parsing
// Raw response: ```json\n{"key": "value\nwith newline"}\n```
// Returns cleaned, validated JSON result
const result = await agent.generateGuide(userInput);
```

Developers do not invoke `_cleanJSON` directly—it operates as an internal safeguard within the agent's response processing pipeline. The cleaning is transparent to callers of `generateGuide()`.

## Testing

No automated tests are currently available for this component. When extending or modifying the resilient parsing logic, test against these common edge cases found in Claude API responses:

- Responses wrapped in markdown code blocks (`` ```json `` delimiters)
- JSON containing unescaped newlines within string values
- Partially formed JSON with missing closing brackets or braces
- Deeply nested structures with incomplete termination
- Mixed escaped and unescaped whitespace in response payloads