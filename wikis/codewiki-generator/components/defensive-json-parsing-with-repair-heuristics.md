---
title: Defensive JSON parsing with repair heuristics
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Defensive JSON Parsing with Repair Heuristics

## Purpose and Overview

This component implements a multi-stage JSON recovery strategy to handle malformed responses from LLM APIs, specifically Claude API responses that may be improperly formatted. It provides robust parsing capabilities that can extract and repair JSON content even when it's wrapped in additional text or contains common formatting errors.

## Key Functionality

The enhanced `_cleanJSON` method employs several repair heuristics in sequence:

- **Content Extraction**: Extracts JSON from responses wrapped in markdown code blocks or other textual content
- **Newline Fixing**: Repairs unescaped newline characters within JSON strings that would break standard parsing
- **String Closure**: Automatically closes unterminated string values to prevent parsing failures
- **Bracket Balancing**: Adds missing closing brackets and braces to complete malformed JSON structures

The method processes input through these stages sequentially, attempting to parse at each step and returning the first successful result.

## Relationships

This component is integrated within the Guide Generation Agent (`lib/agents/guide-generation-agent.js`) to handle the inherent unreliability of LLM-generated JSON responses. It serves as a critical middleware layer between raw API responses and the application's JSON processing pipeline, ensuring that minor formatting issues don't cause complete parsing failures.

## Usage Example

```javascript
// Internal method within GuideGenerationAgent class
const cleanedData = this._cleanJSON(rawLLMResponse);
// Returns parsed JSON object or throws if all repair attempts fail
```

*Note: This is an internal method of the GuideGenerationAgent class and is not directly exposed as a public API. See source code for complete implementation details.*

## Testing

No automated tests found for this component.