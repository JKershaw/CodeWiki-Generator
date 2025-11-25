---
title: WikiResearcher Module
category: component
sourceFile: test-context.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# WikiResearcher Module

## Purpose and Overview

The WikiResearcher module provides a systematic approach for AI agents to gather contextual information from project wikis before performing tasks. It implements a multi-layer context research system that extracts and structures knowledge at different levels (features, philosophy, bugs, onboarding) to ensure agents have appropriate context for various work scenarios.

## Key Functionality

The WikiResearcher module offers two core methods:

- **`gatherContext()`** - Extracts contextual information from wiki sources based on the task type and requirements
- **`formatContextReport()`** - Structures the gathered context into a formatted report suitable for AI agent consumption

The system supports context gathering across diverse task scenarios:
- **Feature Implementation** - Provides technical context and architectural guidance
- **Philosophy Understanding** - Extracts project principles and design philosophies  
- **Bug Investigation** - Gathers relevant debugging context and known issues
- **Onboarding** - Compiles introductory information for new team members

## Relationships

The WikiResearcher module serves as a foundational component in the context-driven task testing pattern, working alongside other AI agent modules to provide informed task execution. It acts as an information layer that feeds contextual knowledge to downstream components that perform actual work tasks.

## Usage Example

```javascript
const WikiResearcher = require('./test-context.js');

const researcher = new WikiResearcher();
const context = await researcher.gatherContext('feature-implementation');
const report = researcher.formatContextReport(context);
```

## Testing

The module implements Context-Driven Task Testing patterns that validate context gathering across multiple task types. Tests verify that the system provides appropriate contextual information for feature implementation, philosophy understanding, bug investigation, and onboarding scenarios. Currently no automated test coverage is available.