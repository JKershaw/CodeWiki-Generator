---
title: Context-aware task optimization
category: concept
sourceFile: lib/wiki-researcher.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Context-aware Task Optimization

## Purpose and Overview

Context-aware task optimization provides intelligent context gathering that adapts to different development task types by prioritizing relevant knowledge layers. This system optimizes information relevance by understanding whether a task involves feature development, bug fixing, architectural changes, or onboarding, then tailoring the context search accordingly.

## Key Functionality

The system implements adaptive context gathering through several key mechanisms:

- **Task Type Recognition**: Analyzes task descriptions to determine the type of work being performed
- **Layer Prioritization**: Adjusts search priorities across meta, code, history, and quality layers based on task type
- **Relevance Scoring**: Calculates weighted scores based on keyword matches in titles, paths, and metadata
- **Context Assembly**: Combines results from multiple layers into structured context packages
- **Adaptive Optimization**: Learns from task patterns to improve context relevance over time

The optimization works by extracting meaningful keywords from task descriptions, then searching across wiki layers with task-specific weightings. For example, bug fixes prioritize history and quality layers, while architectural tasks emphasize meta and code layers.

## Relationships

Context-aware task optimization integrates deeply with the multi-layer wiki research system:

- **Extends WikiResearcher**: Adds task-type awareness to the base research capabilities
- **Leverages WikiManager**: Uses the underlying wiki page retrieval and content access
- **Supports AI Agents**: Provides optimized context input for development assistance tools
- **Integrates with ClaudeClient**: Can utilize AI-enhanced ranking and relevance scoring

## Usage Example

```javascript
const WikiResearcher = require('./lib/wiki-researcher');
const researcher = new WikiResearcher();

// Get optimized context for a specific task type
const context = await researcher.getContextForTaskType('bug', 'authentication error in login flow');

// Or use general context gathering with automatic optimization
const generalContext = await researcher.gatherContext('fix user authentication issues');
```

## Testing

No automated tests are currently available for this component. Testing coverage should be implemented to verify task type detection accuracy and context relevance scoring.