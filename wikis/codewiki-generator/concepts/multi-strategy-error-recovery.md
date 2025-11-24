---
title: Multi-strategy error recovery
category: concept
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-strategy Error Recovery

## Purpose and Overview

Multi-strategy error recovery implements a layered approach to handling malformed AI responses with progressive fallback strategies. This concept enables robust operation when AI outputs are incomplete, truncated, or contain syntax errors that would otherwise break the application.

## Key Functionality

The multi-strategy error recovery system provides several levels of JSON repair and recovery:

- **Truncation Detection**: Identifies incomplete responses from AI models
- **Progressive Parsing**: Attempts to parse partial JSON content by trying different endpoints
- **Syntax Repair**: Fixes common JSON formatting issues like missing brackets or quotes
- **Fallback Strategies**: Applies multiple recovery techniques in sequence until successful parsing is achieved

The core functionality is implemented through the `_cleanJSON` function, which processes malformed AI responses and attempts to extract valid JSON content using these layered strategies.

## Relationships

- **Extends** the existing JSON cleaning functionality in GuideGenerationAgent
- **Provides** resilience for AI response processing across agent interactions  
- **Supports** the overall agent-based architecture by handling AI model output variability
- **Integrates** with the guide generation workflow to ensure consistent operation despite AI response inconsistencies

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();
// The _cleanJSON method is used internally during AI response processing
// to handle malformed responses with multi-strategy recovery
const cleanedData = agent._cleanJSON(malformedAiResponse);
```

*Note: This functionality is primarily used internally by the GuideGenerationAgent during AI response processing. See source code for complete implementation details.*

## Testing

No automated tests found for this component. Consider adding tests to verify the different recovery strategies handle various types of malformed JSON responses correctly.