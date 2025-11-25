---
title: Pattern-based mention detection with priority ranking
category: concept
sourceFile: lib/agents/link-discovery-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Pattern-based Mention Detection with Priority Ranking

## Purpose and Overview

This concept implements a sophisticated multi-pattern matching strategy that detects wiki page mentions within content and ranks them by priority. It uses heuristics to intelligently handle ambiguous mentions while avoiding false positives through markup context checking and deduplication of overlapping matches.

## Key Functionality

The pattern-based detection system operates through several key mechanisms:

- **Multi-pattern matching**: Distinguishes between bold text mentions and plain text mentions, applying different priority scores to each type
- **Priority ranking**: Assigns scores to detected mentions based on formatting context, with bold text typically receiving higher priority than plain text
- **Markup awareness**: Analyzes markdown syntax to avoid detecting mentions within existing links, code blocks, or other formatted content
- **Deduplication**: Removes overlapping matches when the same content is detected by multiple patterns, preserving the highest-priority match
- **Context validation**: Checks surrounding markup to prevent breaking existing markdown structure and avoid double-linking scenarios

This approach uses heuristics rather than full semantic analysis, making it efficient while maintaining accuracy for typical wiki content patterns.

## Relationships

This concept is a core component of the **Cross-page link discovery system** located in the same file. It works closely with **Markdown-aware text analysis** to ensure content integrity during the mention detection process. The priority ranking feeds into the broader link discovery workflow, helping determine which detected mentions should be prioritized for cross-reference suggestions.

## Usage Example

No usage examples available - see source code for implementation details.

## Testing

No automated tests are currently available for this component.