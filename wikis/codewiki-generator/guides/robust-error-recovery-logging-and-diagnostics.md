---
title: Robust error recovery logging and diagnostics
category: guide
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Robust Error Recovery Logging and Diagnostics

## Purpose and Overview

The robust error recovery logging and diagnostics system provides visibility into multi-stage JSON repair attempts when handling malformed responses from Claude. This logging capability enables debugging of production issues and understanding of failure patterns during guide generation.

## Key Functionality

The diagnostic system tracks and logs each stage of the progressive JSON repair process:

- **Stage tracking**: Records which recovery strategies are attempted (truncation, syntax repair, bracket balancing, etc.)
- **Success indicators**: Logs when specific repair methods successfully fix malformed JSON
- **Failure documentation**: Captures details when all repair strategies fail
- **Console warnings**: Outputs structured diagnostic information using `console.warn` statements for production visibility

The logging follows the same cascading fallback pattern as the repair system, providing detailed insight into which specific malformation patterns are encountered and how they're resolved.

## Relationships

This diagnostic system is tightly integrated with the multi-strategy JSON repair components:

- **Multi-strategy JSON repair**: Each repair strategy includes corresponding diagnostic logging
- **Truncation-based recovery**: Logs when incomplete streaming responses are detected and repaired
- **Context-aware JSON syntax repair**: Records specific syntax issues found and fixed
- **Guide generation agent**: Provides operational visibility into Claude response processing failures

## Usage Example

```javascript
// Diagnostic logging is automatically triggered during JSON repair attempts
// Console output examples during error recovery:

// When truncation recovery is attempted:
console.warn('Attempting truncation-based recovery for incomplete response');

// When syntax repair succeeds:
console.warn('JSON syntax repair successful - fixed unescaped newlines');

// When all recovery fails:
console.warn('All JSON repair strategies failed', { originalError, responseLength });
```

## Testing

No automated tests found for the logging and diagnostics functionality.