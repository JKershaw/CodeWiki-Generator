---
title: Truncation-based recovery for incomplete streaming responses
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Truncation-based Recovery for Incomplete Streaming Responses

## Purpose and Overview

Truncation-based recovery detects and repairs incomplete JSON responses from streaming AI services, specifically targeting scenarios where Claude's response generation is cut off mid-stream. This component parses backwards through bracket depth to identify the last complete guide object, enabling extraction of partial but valid data from malformed responses.

## Key Functionality

The recovery mechanism implements a backward-parsing strategy that:

- **Analyzes bracket depth** - Traverses the JSON string in reverse, tracking opening and closing brackets to determine structural completeness
- **Identifies truncation points** - Locates the position where the last complete guide object ends, before any incomplete or malformed content begins
- **Extracts valid portions** - Returns the properly formed JSON segment containing all complete guide objects, discarding truncated fragments
- **Preserves data integrity** - Ensures that recovered JSON maintains valid structure and can be safely parsed without errors

This approach specifically addresses streaming response failures where the connection terminates or token limits are reached mid-generation, leaving trailing incomplete JSON structures.

## Relationships

Truncation-based recovery operates as the first stage in the **Multi-strategy JSON repair with progressive fallbacks** system within the guide generation agent. It works alongside:

- **Context-aware JSON syntax repair** - Handles cases where truncation recovery succeeds but syntax issues remain
- **Robust error recovery logging and diagnostics** - Provides visibility into recovery attempts and success rates
- **Guide generation workflow** - Serves as a critical data recovery mechanism when Claude responses are incomplete

The component is tightly integrated with the streaming response handling logic and feeds into subsequent repair strategies when partial recovery is insufficient.

## Usage Example

```javascript
// Recovery is automatically triggered during JSON parsing failures
// within the guide generation agent's response processing

const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');
const agent = new GuideGenerationAgent();

// Truncation recovery is applied internally when processing responses
const result = await agent.generateGuides(prompt);
// Component automatically attempts truncation-based recovery if JSON parsing fails
```

## Testing

No automated tests found. This component requires integration testing with actual streaming response scenarios to validate truncation detection and recovery effectiveness.