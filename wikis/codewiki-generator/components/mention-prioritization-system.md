---
title: Mention prioritization system
category: component
sourceFile: lib/agents/link-discovery-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Link Discovery Agent

## Purpose and Overview

The Link Discovery Agent automatically detects and extracts cross-page references within wiki content by identifying mentions of other page titles. It enables dynamic linking relationships and populates wiki metadata by analyzing mention frequency and context, reducing the need for manual link curation while preventing false positives through intelligent pattern matching and prioritization.

## Key Functionality

### Mention Detection and Prioritization

The agent scans page content for mentions of wiki page titles using regex-based pattern matching. It distinguishes between different mention types—bold text (`**page title**`) receives higher priority than plain text mentions—ensuring that explicitly formatted references are prioritized as more intentional links.

### Markup-Aware Pattern Matching

To maintain content integrity, the agent analyzes surrounding context to avoid matching text already inside markup (bold, links, code blocks). This prevents creating duplicate links, breaking existing markup, and extracting false positives from formatted content.

### Related Pages Identification

The `findRelatedPages` function identifies related pages by analyzing mention frequency across the content, returning up to 5 pages sorted by mention count. This enables automatic population of frontmatter relationship fields without manual configuration.

### Deduplication with Priority

When overlapping mentions are detected, the agent removes duplicates while preserving higher-priority matches. For example, if the same page title appears both in bold and plain text at overlapping positions, only the bold mention is retained.

## Core Methods

- **`findMentions(content, allPages)`** - Scans content for page title mentions, returning a prioritized list with position metadata
- **`findRelatedPages(content, allPages)`** - Identifies the top related pages by mention frequency
- **`_isInsideMarkup(content, position)`** - Determines if a position falls within markup to prevent false matches
- **`_deduplicateMentions(mentions)`** - Removes overlapping mentions while respecting priority levels

## Relationships

The Link Discovery Agent integrates with:
- **Page collection systems** - Receives `allPages` array containing all available wiki pages
- **Frontmatter metadata** - Populates the `related` field with discovered page relationships
- **Markdown content processing** - Operates on markdown-formatted content requiring markup awareness

## Usage Example

```javascript
const LinkDiscoveryAgent = require('./lib/agents/link-discovery-agent');

const agent = new LinkDiscoveryAgent();
const pageContent = "Check out **Getting Started** and the Configuration guide...";
const allPages = [
  { title: 'Getting Started' },
  { title: 'Configuration' },
  { title: 'API Reference' }
];

// Find all mentions with priority levels
const mentions = agent.findMentions(pageContent, allPages);

// Get top related pages for frontmatter
const relatedPages = agent.findRelatedPages(pageContent, allPages);
```

## Testing

No automated tests are currently available for this component. When contributing changes or extensions to the Link Discovery Agent, ensure:
- Markup-aware pattern matching correctly ignores mentions inside bold, link, and code markup
- Priority deduplication preserves higher-priority (bold) mentions over plain text
- Minimum title length (4 characters) filters appropriately for your wiki size
- Mention frequency thresholds (top 5 pages) align with expected relationship counts