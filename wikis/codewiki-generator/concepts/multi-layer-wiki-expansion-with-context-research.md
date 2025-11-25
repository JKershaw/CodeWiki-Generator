---
title: Multi-layer wiki expansion with context research
category: concept
sourceFile: lib/wiki-researcher.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# WikiResearcher

## Purpose and Overview

The WikiResearcher orchestrates multi-layer context gathering across structured wiki documentation to provide comprehensive, task-specific information. It systematically searches through different wiki layers (meta, code, history, quality) and ranks results by relevance to assemble targeted context packages for various development tasks.

## Key Functionality

**Multi-layer Wiki Expansion**: Searches across multiple documentation layers including high-level concepts, code documentation, implementation guides, historical context, and quality metrics.

**Task-Type Optimization**: Tailors context gathering based on task classification (feature development, bug fixing, architectural decisions, onboarding) to prioritize the most relevant documentation layers for each use case.

**Relevance-Based Ranking**: Scores and ranks wiki pages using keyword matching weighted by location importance (title matches score higher than path or theme matches) to surface the most pertinent information.

**Structured Context Assembly**: Compiles gathered information into organized markdown reports with clear sections by layer type, providing standardized output for downstream consumption.

**Keyword Extraction**: Analyzes input queries to identify key search terms for systematic exploration across wiki layers.

## Relationships

The WikiResearcher acts as a bridge between the **WikiManager** (which handles wiki storage and retrieval) and task-specific context requirements. It consumes structured wiki data and produces formatted context reports that can be used by other tools or presented directly to users for informed decision-making.

## Usage Example

```javascript
const WikiResearcher = require('./lib/wiki-researcher');

const researcher = new WikiResearcher(wikiManager);
const context = await researcher.gatherContext(query, taskType);
const report = researcher.formatContextReport(context);
```

## Testing

No automated tests found for this component.