---
title: Markup-aware pattern matching
category: component
sourceFile: lib/agents/link-discovery-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Markup-aware Pattern Matching

## Purpose and Overview

The `LinkDiscoveryAgent` automatically detects cross-page hyperlink opportunities by scanning wiki page content for mentions of other page titles. It enables dynamic relationship discovery between pages while maintaining accuracy by avoiding false positives within existing markup (bold text, links, code blocks), and prioritizes explicit references to populate frontmatter relationship fields.

## Key Functionality

### Link Discovery Process

The agent scans page content using regex pattern matching to identify mentions of wiki page titles. It performs the following operations:

- **Mention Extraction** (`findMentions`): Locates all instances of page title mentions in content, returning positions and priority levels
- **Markup Awareness** (`_isInsideMarkup`): Filters out matches that fall within bold, link, or code markup to prevent duplicate linking and markup corruption
- **Priority Classification**: Distinguishes between bold text mentions (high priority) and plain text mentions (normal priority), allowing explicit references to take precedence
- **Deduplication** (`_deduplicateMentions`): Removes overlapping detections while preserving higher-priority matches
- **Related Pages Identification** (`findRelatedPages`): Analyzes mention frequency to identify the top 5 related pages, sorted by mention count

### Pattern Safety

The agent sanitizes page titles using `_escapeRegex` to safely convert titles into regex patterns, preventing regex injection attacks and proper handling of special characters.

## Relationships

- **Wiki Content System**: Operates on markdown-formatted page content, requiring awareness of markdown syntax
- **Page Collection**: Receives an array of all wiki pages to match against
- **Frontmatter Integration**: Populates `related` fields in page metadata with discovered relationships
- **Link Generation**: Provides the foundation for automated cross-page linking workflows

## Usage Example

```javascript
const { LinkDiscoveryAgent } = require('./lib/agents/link-discovery-agent');

const agent = new LinkDiscoveryAgent();

// Find all mentions of wiki pages in content
const mentions = agent.findMentions(pageContent, allPages);
// Returns: [{ title: 'Page Title', positions: [42, 156], priority: 'bold' }, ...]

// Identify top related pages by mention frequency
const relatedPages = agent.findRelatedPages(pageContent, allPages);
// Returns: Array of up to 5 page objects sorted by mention count
```

## Configuration Notes

- **Minimum Title Length**: Titles shorter than 4 characters are excluded from matching
- **Related Pages Limit**: Only the top 5 most-mentioned pages are returned
- **Priority Levels**: Bold text mentions receive higher priority than plain text, ensuring intentional references are preserved during deduplication

## Testing

No automated tests are currently available. Manual testing is recommended when modifying pattern matching logic or markup detection rules.