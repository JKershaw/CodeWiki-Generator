---
title: WikiResearcher component
category: component
sourceFile: lib/wiki-researcher.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# WikiResearcher Component

## Purpose and Overview

The WikiResearcher component provides intelligent, multi-layer search capabilities across wiki knowledge bases to gather comprehensive context for development tasks. It systematically organizes wiki content into distinct layers (meta, code, history, quality) and delivers task-optimized context packages through relevance-based ranking and adaptive search strategies.

## Key Functionality

**Multi-Layer Search Architecture**
- Searches across four specialized wiki layers: meta (documentation), code (technical references), history (project evolution), and quality (standards and processes)
- Maps logical layers to corresponding wiki directory structures for organized knowledge retrieval
- Extracts meaningful keywords from task descriptions to target search operations

**Context-Aware Optimization**
- Calculates relevance scores based on keyword matches in titles, file paths, and metadata themes
- Ranks results by relevance within each layer for prioritized information delivery
- Adapts context gathering strategies based on task type (feature development, bug fixes, architectural decisions, onboarding)

**Structured Context Assembly**
- Assembles comprehensive context packages combining results from all relevant layers
- Generates human-readable markdown reports from gathered context objects
- Provides task-specific context optimization with tailored layer priorities

## Relationships

- **Depends on WikiManager**: Uses WikiManager for page retrieval and content access across the wiki system
- **Integrates with ClaudeClient**: Leverages AI capabilities for enhanced ranking and context processing
- **Extends Wiki System**: Builds upon the existing wiki infrastructure to add intelligent search capabilities
- **Supports AI Agents**: Provides structured, contextual input for AI agents requiring comprehensive knowledge bases

## Usage Example

```javascript
const WikiResearcher = require('./lib/wiki-researcher');

// Initialize the researcher with wiki manager
const researcher = new WikiResearcher(wikiManager);

// Gather context for a development task
const context = await researcher.gatherContext("implement user authentication feature");

// Get optimized context for specific task types
const bugContext = await researcher.getContextForTaskType("bug", "login validation error");
const archContext = await researcher.getContextForTaskType("architectural", "database migration strategy");

// Generate formatted report
const report = researcher.formatContextReport(context);
```

## Testing

No automated tests are currently available for this component. Testing coverage should be implemented to validate multi-layer search functionality, relevance scoring accuracy, and task-specific context optimization.