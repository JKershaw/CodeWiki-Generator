---
title: Multi-layer Context Research System
category: concept
sourceFile: test-context.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-layer Context Research System

## Purpose and Overview

The Multi-layer Context Research System provides a systematic approach for AI agents to gather comprehensive contextual information before performing tasks. It enables agents to understand project context at multiple levels including features, philosophy, bugs, and onboarding requirements through structured wiki research.

## Key Functionality

The system operates through the **WikiResearcher Module** which serves as the core component for context gathering:

- **`gatherContext()`** - Extracts contextual information from wiki sources based on task requirements
- **`formatContextReport()`** - Structures the gathered information into organized reports for different scenarios

The system supports context research across diverse task types:
- Feature implementation context
- Project philosophy and principles
- Bug investigation background
- New developer onboarding information

## Relationships

The Multi-layer Context Research System connects to:
- **WikiResearcher Module** - Acts as the primary interface for context operations
- **AI Agent Task Framework** - Provides contextual foundation before agents execute tasks
- **Project Documentation** - Sources information from wiki-based knowledge repositories

## Usage Example

```javascript
const WikiResearcher = require('./wiki-researcher');

const researcher = new WikiResearcher();
const context = await researcher.gatherContext(taskType, requirements);
const report = researcher.formatContextReport(context);
```

## Testing

The system includes **Context-Driven Task Testing** that validates context gathering across multiple scenarios. Testing covers feature implementation, philosophy understanding, bug investigation, and onboarding contexts to ensure appropriate information is provided for different work scenarios. Currently no automated test coverage is available in the test suite.