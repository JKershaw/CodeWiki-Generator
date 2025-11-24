---
title: Content-based page relationship inference
category: concept
sourceFile: lib/agents/link-discovery-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Link Discovery Agent

## Purpose and Overview

The Link Discovery Agent automatically detects cross-page relationships within wiki content by identifying mentions of page titles and analyzing their frequency. This enables dynamic population of frontmatter relationship fields without manual curation, improving wiki interconnectedness and discoverability.

## Key Functionality

**Cross-Page Link Detection**  
Scans page content for mentions of wiki page titles using regex-based pattern matching, returning a prioritized list of potential link targets with position metadata.

**Mention Prioritization**  
Distinguishes between different types of mentions (bold vs plain text) to determine which links are most intentional, preventing false positives by prioritizing explicit references.

**Markup-Aware Extraction**  
Prevents duplicate links and markup corruption by detecting whether matched text already falls within bold, link, or code markup, ensuring accurate extraction of only valid mention opportunities.

**Related Pages Identification**  
Analyzes mention frequency across a page's content to identify the top 5 related pages, sorted by how often they're mentioned. This result populates relationship fields in page frontmatter automatically.

**Mention Deduplication**  
Removes overlapping mention detections while preserving higher-priority matches, ensuring clean and non-redundant link suggestions.

## Relationships

- **Frontmatter Integration**: Populates the 'related' field in page metadata based on mention analysis
- **Page Collections**: Requires access to `allPages` array from wiki page discovery systems
- **Content Processing**: Operates on markdown-formatted content and maintains awareness of markdown syntax
- **Link Generation**: Provides the foundation for automated wiki linking workflows

## Usage Example

```javascript
const LinkDiscoveryAgent = require('./lib/agents/link-discovery-agent');

// Initialize with all available pages
const agent = new LinkDiscoveryAgent({
  allPages: [
    { title: 'React Basics', path: '/react-basics' },
    { title: 'Component Patterns', path: '/component-patterns' },
    { title: 'State Management', path: '/state-management' }
  ]
});

// Find mentions of pages within content
const mentions = agent.findMentions(
  'This guide covers **React Basics** and Component Patterns in detail.'
);

// Identify top related pages by mention frequency
const relatedPages = agent.findRelatedPages(
  'React Basics are essential. Component Patterns improve design. React Basics appear again.'
);
```

## Configuration Notes

- **Minimum title length**: Titles shorter than 4 characters are not matched
- **Related pages limit**: Only the top 5 most-mentioned pages are returned
- These thresholds are currently hardcoded; adjust in source code for different wiki sizes

## Testing

No automated test coverage is currently available. See source code at `lib/agents/link-discovery-agent.js` for implementation details.