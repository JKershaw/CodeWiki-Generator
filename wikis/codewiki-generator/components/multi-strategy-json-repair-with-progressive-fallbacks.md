---
title: Multi-strategy JSON repair with progressive fallbacks
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-strategy JSON repair with progressive fallbacks

## Purpose and Overview

The multi-strategy JSON repair system provides robust error recovery for malformed JSON responses from Claude AI, particularly when responses are truncated or contain syntax errors during streaming. It implements a cascading fallback strategy that attempts increasingly aggressive repair techniques to salvage usable data from corrupted responses.

## Key Functionality

The repair system employs five progressive fallback strategies:

1. **Truncation to last complete guide** - Parses backwards through bracket depth to find the last complete guide object when responses are cut off mid-generation
2. **Syntax fixes** - Repairs common JSON malformations including unescaped newlines within strings and unterminated strings
3. **Bracket balancing** - Adds missing closing brackets and braces to complete malformed JSON structures  
4. **Trailing comma removal** - Strips invalid trailing commas that break JSON parsing
5. **Last-resort array extraction** - Attempts to extract valid array data when other strategies fail

Each repair stage includes diagnostic logging via `console.warn` to track which recovery strategies were attempted and successful, supporting debugging and production monitoring of failure patterns.

## Relationships

This component is integrated within the Guide Generation Agent (`lib/agents/guide-generation-agent.js`) and serves as the error recovery layer for processing Claude AI responses. It works in conjunction with:

- **Claude API responses** - Primary input source that may contain malformed JSON
- **Guide generation pipeline** - Downstream consumer of repaired JSON data  
- **Logging system** - Reports repair attempts and success/failure patterns

## Usage Example

```javascript
// The repair system is integrated within the guide generation agent
// and automatically activates when JSON parsing fails

// Internal usage pattern within the agent:
try {
  const guides = JSON.parse(response);
  return guides;
} catch (error) {
  console.warn('JSON parsing failed, attempting repair strategies');
  
  // Strategy 1: Truncation-based recovery
  const repairedResponse = truncateToLastCompleteGuide(response);
  
  // Strategy 2-4: Syntax repairs, bracket balancing, comma removal
  const syntaxFixed = applySyntaxFixes(repairedResponse);
  
  // Strategy 5: Last-resort array extraction
  const extractedData = extractValidArray(syntaxFixed);
  
  return JSON.parse(extractedData);
}
```

## Testing

No automated tests found for this component. Testing would benefit from coverage of each repair strategy with various malformed JSON inputs to ensure robust error recovery.