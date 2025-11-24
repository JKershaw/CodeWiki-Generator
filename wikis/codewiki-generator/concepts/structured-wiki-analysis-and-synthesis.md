---
title: Structured wiki analysis and synthesis
category: concept
sourceFile: lib/wiki-context-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiContextService

## Purpose and Overview

WikiContextService provides AI-powered intelligent context research for development tasks by analyzing wiki content and extracting semantically relevant information. Instead of simple keyword matching, it uses artificial intelligence to understand the relationship between development tasks and existing wiki documentation, synthesizing actionable guidance from structured wiki analysis.

## Key Functionality

The service orchestrates a multi-step process to deliver intelligent context:

- **Content Retrieval**: Accesses all wiki pages through WikiManager and parses markdown files with YAML frontmatter
- **AI Analysis**: Uses ClaudeClient to perform semantic analysis of wiki content against specific development tasks
- **Structured Synthesis**: Processes AI responses into consistent formats with summaries, relevant components, and actionable guidance
- **Category Inference**: Automatically categorizes wiki content and infers relationships between different documentation sections

The core `research()` method takes a task description and returns structured insights including relevant wiki sections, implementation guidance, and contextual recommendations.

## Relationships

WikiContextService integrates with several core components:

- **Depends on WikiManager**: Accesses wiki content and file system operations
- **Integrates with ClaudeClient**: Leverages AI capabilities for semantic analysis and content synthesis
- **Extends wiki system**: Adds intelligent layer on top of existing wiki management functionality
- **Complements documentation workflow**: Transforms static wiki content into dynamic, task-specific research assistance

## Usage Example

```javascript
const WikiContextService = require('./lib/wiki-context-service');

// Initialize with wiki base path
const service = new WikiContextService({
  wikiBasePath: './docs/wiki'
});

// Research context for a development task
const results = await service.research("implement user authentication system");

// Results contain structured guidance
console.log(results.summary);
console.log(results.components);
console.log(results.guidance);

// Get usage statistics
const stats = service.getStatistics();
console.log(`Processed ${stats.requestCount} requests`);
```

## Testing

**Test Coverage**: `tests/unit/wiki-context-service.test.js`
- 31 comprehensive test cases across 10 test suites
- Coverage includes: WikiContextService initialization, research functionality, frontmatter parsing, title extraction, category inference, statistics tracking, error handling, and result formatting
- Tests validate both successful operations and error conditions with mocked dependencies