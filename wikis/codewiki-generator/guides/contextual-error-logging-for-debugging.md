---
title: Contextual error logging for debugging
category: guide
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Contextual Error Logging for Debugging

## Purpose and Overview

Provides detailed diagnostic logging when JSON parsing failures occur during guide generation, capturing response characteristics and error context to help operators identify and troubleshoot parsing issues. This logging component works alongside the multi-stage JSON parsing robustness system to provide visibility into what caused failures without interrupting system operation.

## Key Functionality

When JSON parsing fails in the guide generation process, this component captures and logs:

- **Response metadata** - Length and size of the raw response from the API
- **Content preview** - Sample chunks of the response data to help identify formatting issues
- **Error context** - Specific parsing error details and the stage at which parsing failed
- **Diagnostic information** - Additional context about the parsing attempt and validation results

The logging integrates with the graceful degradation system, ensuring that detailed error information is captured even when the system continues operating with fallback responses.

## Relationships

- **Works with Multi-stage JSON parsing robustness** - Provides diagnostic output when parsing layers fail
- **Supports Graceful degradation** - Logs errors while the system continues with empty fallback responses  
- **Complements Filtering invalid data** - Records why specific guides were filtered out due to validation failures
- **Part of Guide Generation Agent** - Embedded within the broader guide generation error handling pipeline

## Usage Example

```javascript
// This logging is automatically triggered during guide generation failures
// No direct API - integrated into the parsing workflow

const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');
const agent = new GuideGenerationAgent();

// When parsing fails, contextual logging automatically captures:
// - Response length and preview chunks
// - Specific error details and parsing stage
// - Validation context for debugging
const guides = await agent.generateGuides(input); // Logs errors internally
```

## Testing

No automated tests found for this logging component.