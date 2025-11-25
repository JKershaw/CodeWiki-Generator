---
title: Task-type-optimized context prioritization
category: concept
sourceFile: lib/wiki-researcher.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Task-type-optimized context prioritization

## Purpose and Overview

Task-type-optimized context prioritization is a design pattern that tailors wiki context gathering based on specific task classifications such as feature development, bug fixes, architectural changes, and onboarding. This approach ensures that different task types receive the most relevant documentation layers and depth, moving away from generic one-size-fits-all context retrieval to provide more targeted and useful information.

## Key Functionality

The prioritization system works by:

- **Task Classification Analysis** - Identifies the type of task being performed (feature, bug, architectural, onboarding)
- **Layer-Specific Targeting** - Determines which wiki layers (meta, code, history, quality) are most relevant for each task type
- **Depth Optimization** - Adjusts the depth of context gathering based on task requirements
- **Relevance Weighting** - Applies different scoring weights to documentation based on task context
- **Structured Output** - Delivers prioritized context in a format optimized for the specific task type

Different task types receive customized context:
- **Feature tasks** may prioritize code documentation and architectural guides
- **Bug fixes** might emphasize historical changes and quality metrics
- **Architectural work** focuses on high-level design and system relationships
- **Onboarding** targets foundational guides and overview documentation

## Relationships

This pattern is implemented by the **WikiResearcher class** which orchestrates the research workflow and connects to:

- **WikiManager** - Provides access to the underlying wiki data structure
- **Multi-layer wiki expansion** - Uses the layered architecture to gather comprehensive context
- **Relevance-based ranking system** - Applies task-specific scoring to prioritize results
- **Context report formatting** - Presents results in task-optimized markdown format

## Usage Example

```javascript
const WikiResearcher = require('./lib/wiki-researcher');

const researcher = new WikiResearcher(wikiManager);
const context = researcher.gatherContext(keywords, taskType);
```

*Note: Specific API details and parameters should be referenced from the source implementation.*

## Testing

No automated tests found for this component.