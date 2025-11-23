---
title: Resilient LLM response parsing
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Resilient LLM Response Parsing

## Purpose and Overview

Resilient LLM response parsing addresses the common challenge of extracting structured data from Large Language Model responses that may contain malformed JSON or unexpected wrapper content. This approach implements defensive programming patterns to reliably parse structured outputs from external AI APIs, particularly when the response format cannot be guaranteed.

## Key Functionality

The system employs a **[Progressive JSON repair strategy](../components/progressive-json-repair-strategy.md)** that attempts multiple repair techniques in sequence:

1. **Content Extraction** - Strips markdown code blocks, removes wrapper text, and isolates potential JSON content
2. **String Repair** - Fixes common JSON formatting issues like unescaped quotes, trailing commas, and malformed strings  
3. **Structure Completion** - Attempts to complete truncated or incomplete JSON objects and arrays
4. **Fallback Handling** - Gracefully degrades when repair attempts fail

### Core Implementation

The `_cleanJSON` function serves as the primary entry point for the repair process:

- Accepts raw LLM response text as input
- Applies progressive repair techniques automatically
- Returns parsed JSON object or throws descriptive error
- Logs repair attempts for debugging and monitoring

## Relationships

- **[GuideGenerationAgent](../components/guide-generation-agent.md)**: Integrated into the response processing pipeline to ensure reliable parsing of generated guide content
- **Claude API Integration**: Specifically addresses parsing reliability issues when working with Anthropic's Claude API responses
- **Error Handling System**: Connects to broader application error handling to provide meaningful feedback when parsing fails

## Usage Examples

```python
# Basic usage within an agent
raw_response = await claude_client.generate_response(prompt)
try:
    parsed_data = self._cleanJSON(raw_response)
    # Process structured data...
except JSONParseError as e:
    # Handle parsing failure gracefully
    logger.error(f"Failed to parse LLM response: {e}")
```

This pattern can be extended to other agents that require structured output parsing from LLM responses, making it a reusable component for improving reliability across the codebase.