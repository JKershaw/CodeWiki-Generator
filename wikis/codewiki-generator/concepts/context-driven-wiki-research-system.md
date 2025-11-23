---
title: Context-driven wiki research system
category: concept
sourceFile: test-context.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Context-driven Wiki Research System

## Purpose and Overview

The context-driven wiki research system provides an automated approach to gathering relevant contextual information from wiki content based on task descriptions. It enables intelligent, context-aware operations by analyzing wiki documentation and extracting pertinent information for specific development scenarios.

## Key Functionality

The system centers around the `WikiResearcher` class, which implements two core methods:

- **`gatherContext()`** - Analyzes wiki content to extract information relevant to a given task description
- **`formatContextReport()`** - Structures the gathered context into a readable report format

The system handles diverse research scenarios including:
- Feature implementation guidance
- Bug investigation support  
- Developer onboarding assistance
- General codebase exploration

## Relationships

- **Depends on**: `WikiResearcher` class from `./lib/wiki-researcher`
- **Data Source**: Wiki content stored in `wikis/codewiki-generator` directory
- **Testing**: Validated through `test-context.js` with predefined test scenarios
- **Integration**: Designed to support context-aware development workflows

## Usage Example

```javascript
const WikiResearcher = require('./lib/wiki-researcher');

// Initialize the researcher
const researcher = new WikiResearcher();

// Gather context for a specific task
const context = researcher.gatherContext("implement user authentication feature");

// Format the results into a readable report
const report = researcher.formatContextReport(context);

console.log(report);
```

## Testing

The system includes comprehensive test validation through `testContextGathering()` function, which runs multiple predefined scenarios covering common wiki research use cases. Test cases are defined in the `testCases` constant and validate the system's ability to handle different types of development tasks and information gathering requirements.