---
title: JSON response cleaning for LLM APIs
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# JSON Response Cleaning for LLM APIs

## Purpose and Overview

LLM APIs often return JSON responses wrapped in markdown code blocks (````json...````), which breaks standard JSON parsing. This utility handles the preprocessing step to extract clean JSON from LLM responses before parsing.

## Key Functionality

The `_cleanJSON` function removes markdown code block wrappers from LLM responses:

- **Strips markdown delimiters**: Removes ````json` opening tags and closing ```` tags
- **Preserves JSON structure**: Maintains the original JSON formatting and content
- **Enables standard parsing**: Allows the cleaned response to be parsed with standard JSON libraries

The cleaning process handles common LLM response patterns where structured data is wrapped in code formatting for better readability in chat interfaces.

## Relationships

- **Integrates with GuideGenerationAgent**: Part of the JSON parsing workflow for processing LLM-generated guide content
- **Claude API pipeline**: Specifically handles response preprocessing in the Claude API integration
- **Error prevention**: Reduces JSON parsing failures by normalizing response formats before parsing attempts

## Usage Examples

```python
# Typical LLM response format
llm_response = """```json
{
  "title": "Getting Started",
  "steps": ["Install", "Configure", "Run"]
}
```"""

# After cleaning
cleaned = _cleanJSON(llm_response)
# Returns: '{\n  "title": "Getting Started",\n  "steps": ["Install", "Configure", "Run"]\n}'

# Now safe for standard JSON parsing
data = json.loads(cleaned)
```

This preprocessing step is essential when working with LLMs that format their JSON outputs for human readability rather than direct programmatic consumption.