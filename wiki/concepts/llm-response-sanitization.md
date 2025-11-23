---
title: LLM response sanitization
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# LLM Response Sanitization

## Purpose and Overview

LLM response sanitization addresses the common issue where LLM APIs return JSON content wrapped in markdown code blocks, making direct JSON parsing impossible. This preprocessing step ensures reliable JSON extraction from LLM responses before parsing.

## Key Functionality

The `_cleanJSON` function performs response sanitization by:

- **Removing markdown code block wrappers** - Strips `json` and backtick delimiters that commonly wrap LLM JSON responses
- **Preserving JSON content** - Extracts only the actual JSON payload while maintaining its structure
- **Preventing parse errors** - Eliminates formatting that would cause `JSON.parse()` to fail

### How It Works

```javascript
// Before sanitization (typical LLM response)
```json
{
  "key": "value",
  "items": ["a", "b", "c"]
}
```

// After sanitization (ready for JSON.parse)
{
  "key": "value", 
  "items": ["a", "b", "c"]
}
```

## Relationships

- **Part of GuideGenerationAgent's response processing pipeline** - Processes Claude API responses before JSON parsing
- **Handles Claude API formatting inconsistencies** - Manages the unpredictable markdown wrapping in Claude responses
- **Prevents downstream parsing failures** - Ensures clean input for JSON parsing operations

## Usage Context

This sanitization is particularly important when:
- Working with Claude API responses that inconsistently wrap JSON in markdown
- Building reliable JSON parsing pipelines for LLM-generated content
- Ensuring consistent data extraction across different LLM response formats

The function acts as a defensive preprocessing layer, making LLM response handling more robust and predictable.