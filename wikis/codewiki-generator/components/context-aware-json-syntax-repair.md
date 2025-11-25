---
title: Context-aware JSON syntax repair
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Context-aware JSON syntax repair

## Purpose and Overview

Context-aware JSON syntax repair provides intelligent recovery mechanisms for malformed JSON responses from AI agents, particularly Claude's streaming responses. It implements progressive repair strategies that gracefully degrade from truncation recovery to syntax fixes, ensuring maximum data extraction even from severely corrupted JSON output.

## Key Functionality

The repair system operates through a cascading fallback strategy with five distinct recovery stages:

1. **Truncation recovery** - Detects incomplete streaming responses by parsing backwards through bracket depth to find the last complete guide object, allowing extraction of partial but valid data
2. **Syntax fixes** - Repairs common JSON malformations including unescaped newlines within strings, unterminated strings, and improper escape sequences using context-aware parsing
3. **Bracket balancing** - Automatically closes unclosed brackets and braces while respecting JSON structural semantics
4. **Trailing comma removal** - Strips invalid trailing commas that would break JSON parsing
5. **Last-resort array extraction** - Attempts to salvage any valid JSON objects from completely malformed responses

Each repair stage respects JSON semantics rather than performing crude text replacements. The system includes comprehensive logging at each stage to track which recovery strategies were attempted and successful, supporting debugging and failure pattern analysis.

## Relationships

This component is integrated within the guide generation agent (`guide-generation-agent.js`) to handle malformed responses from Claude's API. It acts as a critical error recovery layer between the raw AI response and the application's JSON parsing logic, ensuring the guide generation pipeline remains robust against various response quality issues.

## Usage Example

No usage examples available - see source code for implementation details. The repair functionality is internally integrated within the guide generation agent's response processing pipeline.

## Testing

No automated tests found for this component.