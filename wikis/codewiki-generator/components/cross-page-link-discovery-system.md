---
title: Cross-page link discovery system
category: component
sourceFile: lib/agents/link-discovery-agent.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Cross-page Link Discovery System

## Purpose and Overview

The cross-page link discovery system automatically detects mentions of wiki pages within content and generates intelligent cross-page hyperlinks. It enables automatic link suggestion and related pages discovery, which is essential for building connected wiki navigation through pattern-based mention detection.

## Key Functionality

- **Pattern-based Mention Detection**: Implements multi-pattern matching strategy using both bold text and plain text patterns with priority scoring to handle ambiguous mentions intelligently
- **Markdown-aware Text Analysis**: Respects markdown syntax by avoiding linking text that's already marked up or inside code blocks, preventing double-linking and maintaining content integrity
- **Priority Ranking System**: Prioritizes mentions found in bold formatting over plain text references to improve link relevance
- **Deduplication Logic**: Removes overlapping matches and ensures unique page references in results
- **False Positive Prevention**: Checks markup context to avoid breaking existing markdown structure

The system uses heuristics rather than full semantic analysis, making it efficient while still providing intelligent cross-reference suggestions for wiki content.

## Relationships

- **Agent Architecture**: Operates as `LinkDiscoveryAgent` within a broader agent-based system for delegated content analysis tasks
- **Content Processing Pipeline**: Integrates with markdown processing workflows to enhance content with automatic linking capabilities  
- **Wiki Navigation Systems**: Provides discovered page relationships that support navigation and content discovery features
- **Cross-reference Generation**: Feeds relationship data to systems that generate "See Also" sections and related page recommendations

## Usage Example

```javascript
const LinkDiscoveryAgent = require('./lib/agents/link-discovery-agent');

const agent = new LinkDiscoveryAgent();
const content = "This relates to **User Management** and authentication systems.";
const discoveredLinks = agent.discoverLinks(content);
```

## Testing

No automated tests are currently available for this component. Manual testing and integration verification are recommended when implementing or modifying the link discovery functionality.