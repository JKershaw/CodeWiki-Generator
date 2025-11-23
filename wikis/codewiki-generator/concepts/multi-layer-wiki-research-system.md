---
title: Multi-layer wiki research system
category: concept
sourceFile: lib/wiki-researcher.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# WikiResearcher

## Purpose and Overview

The WikiResearcher component implements a multi-layer intelligence system that searches across structured wiki knowledge to gather comprehensive context for development tasks. It organizes wiki content into distinct layers (meta, code, history, quality) and provides intelligent ranking to deliver the most relevant information based on task type and keywords.

## Key Functionality

**Multi-Layer Search Architecture**
- Searches across four knowledge layers: meta (high-level concepts), code (implementation details), history (decisions and evolution), and quality (standards and processes)
- Uses keyword extraction and relevance scoring to rank results based on title matches, file paths, and metadata themes
- Supports task-specific optimization that prioritizes different layers based on whether the work involves features, bugs, architecture, or onboarding

**Context Assembly and Reporting**
- Aggregates search results across all layers into structured context objects
- Generates human-readable markdown reports for easy consumption
- Provides both programmatic access to context data and formatted output for documentation

**Intelligent Ranking System**
- Calculates relevance scores using weighted keyword matching across titles, paths, and themes
- Organizes results by layer while maintaining overall relevance hierarchy
- Adapts search strategies based on task type to surface the most pertinent information

## Relationships

The WikiResearcher extends the existing wiki infrastructure by integrating with WikiManager for content retrieval and page access. It provides structured context input for AI agents and development tools, while potentially leveraging ClaudeClient for enhanced ranking capabilities. The component acts as an intelligence layer that transforms static wiki content into dynamically relevant knowledge packages.

## Usage Example

```javascript
const WikiResearcher = require('./lib/wiki-researcher');

const researcher = new WikiResearcher(wikiManager);
const context = await researcher.gatherContext("implement user authentication");
const report = researcher.formatContextReport(context);

// Task-specific context gathering
const bugContext = await researcher.getContextForTaskType("bug", "login error");
```

## Testing

No automated tests are currently available for this component. Testing coverage should be implemented to verify multi-layer search accuracy, relevance scoring algorithms, and context assembly functionality.