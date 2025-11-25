---
title: Automatic link discovery and suggestion system
category: component
sourceFile: lib/agents/link-discovery-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Automatic Link Discovery and Suggestion System

## Purpose and Overview

The automatic link discovery and suggestion system intelligently detects mentions of wiki pages within content and automatically creates cross-page links without manual intervention. It uses pattern matching to identify both bold text mentions and plain text references, while avoiding false positives in existing markup.

## Key Functionality

The system provides several core capabilities:

- **Pattern-based mention detection**: Identifies wiki page mentions using multiple patterns including bold text markers and plain text with word boundaries
- **Priority-based mention ranking**: Implements a prioritization scheme where bold text mentions (priority 1) take precedence over plain text mentions (priority 2) when matches overlap
- **Markup-aware text analysis**: Prevents false positive suggestions by scanning content to avoid linking within existing markdown markup (bold, links, code blocks)
- **Intelligent deduplication**: Resolves conflicts when multiple match patterns overlap at the same position, ensuring higher-confidence suggestions are preferred
- **Related pages inference**: Automatically generates up to 5 related pages for any given page by analyzing mention frequency in its content

## Relationships

This component integrates with:

- **Content processing pipeline**: Analyzes wiki page content to identify linkable mentions
- **Frontmatter management**: Populates the `related:` field in page frontmatter with discovered related pages
- **Markdown rendering system**: Works alongside existing markdown processors to enhance content without breaking existing formatting

## Usage Example

```javascript
const LinkDiscoveryAgent = require('./lib/agents/link-discovery-agent');

// Initialize the link discovery agent
const agent = new LinkDiscoveryAgent();

// Process content to discover potential links
const content = "This mentions **ImportantConcept** and also references AnotherPage";
const suggestions = agent.discoverLinks(content);

// Generate related pages for a specific page
const relatedPages = agent.inferRelatedPages(pageContent);
```

## Testing

No automated tests found. Testing coverage should be implemented to verify pattern matching accuracy, markup detection, and deduplication logic.