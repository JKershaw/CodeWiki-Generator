---
title: Progressive JSON repair with truncation recovery
category: concept
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Progressive JSON repair with truncation recovery

## Purpose and Overview

This concept implements a multi-layered error recovery strategy for handling malformed or truncated JSON responses from language models. It progressively attempts different repair strategies, starting with truncation recovery to find complete data structures, then applying syntax fixes, and finally falling back to last-resort content extraction.

## Key Functionality

The progressive JSON repair system operates through multiple sequential strategies:

- **Truncation Recovery**: Identifies complete JSON structures within partial responses by progressively truncating content and testing for valid JSON
- **Syntax Repair**: Applies common JSON fixes like adding missing brackets, quotes, and commas to malformed responses  
- **Content Extraction**: As a last resort, extracts usable data from responses that cannot be fully repaired
- **Multi-Strategy Fallback**: Each repair method is attempted in sequence until valid JSON is recovered or all options are exhausted

The `_cleanJSON` function serves as the main entry point, implementing enhanced JSON repair logic that handles the common issue of LLM responses being cut off mid-generation or containing syntax errors.

## Relationships

This component is tightly integrated with the guide generation system:

- **Claude AI Response Handler**: Processes responses from Claude AI that may be truncated or malformed
- **Guide Generation Agent**: Supports the robustness of guide generation by ensuring content can be extracted even from imperfect LLM responses
- **Error Recovery Pipeline**: Provides fallback strategies that prevent complete failures when parsing LLM output

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();

// Internal usage within the agent when processing LLM responses
const malformedResponse = '{"title": "Guide", "steps": [{"name": "Step 1"'; // truncated
const repairedJSON = agent._cleanJSON(malformedResponse);
// Returns valid JSON object with recovered content
```

## Testing

No automated tests found for this component. Testing coverage should be added to verify the various repair strategies work correctly with different types of malformed JSON responses.