---
title: WikiContextService
category: component
sourceFile: lib/wiki-context-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiContextService

## Purpose and Overview

WikiContextService provides AI-powered context research for development tasks by analyzing wiki pages to extract semantically relevant information. Rather than relying on simple keyword matching, it uses intelligent analysis to understand the relationship between development tasks and existing wiki documentation, delivering actionable insights and guidance.

## Key Functionality

The service orchestrates a multi-step process for intelligent wiki analysis:

- **Content Retrieval**: Gathers all wiki pages with their full content for comprehensive analysis
- **Frontmatter Processing**: Extracts metadata and content from markdown files with YAML frontmatter
- **AI-Powered Analysis**: Leverages ClaudeClient to perform semantic analysis of wiki content against specific development tasks
- **Structured Output**: Returns formatted results including summary insights, relevant components, and actionable development guidance
- **Usage Tracking**: Monitors AI usage statistics and costs for resource management

The core workflow involves building research prompts that combine wiki content with task descriptions, processing AI responses, and formatting results into a consistent structure that developers can immediately act upon.

## Relationships

WikiContextService integrates with several key components in the codebase:

- **Depends on WikiManager**: Uses WikiManager to access and retrieve wiki content from the filesystem
- **Integrates with ClaudeClient**: Leverages AI capabilities for semantic content analysis and synthesis
- **Extends Wiki System**: Adds intelligent context extraction capabilities to the existing wiki management infrastructure
- **Complements Documentation Tools**: Provides semantic understanding that enhances traditional wiki browsing and search

## Usage Example

```javascript
const WikiContextService = require('./lib/wiki-context-service');

// Initialize service with wiki path and Claude client
const service = new WikiContextService({
  wikiBasePath: './wiki',
  claudeClient: mockClaudeClient
});

// Research context for a development task
const results = await service.research('implement user authentication system');

// Access structured results
console.log(results.summary);      // AI-generated summary
console.log(results.components);   // Relevant components identified
console.log(results.guidance);     // Actionable development guidance

// Check usage statistics
const stats = service.getStatistics();
console.log(`Processed ${stats.requestCount} requests, ${stats.totalTokens} tokens`);
```

## Testing

Comprehensive test coverage is provided in `tests/unit/wiki-context-service.test.js` with **31 test cases** across **10 test suites**. Test categories include core functionality (constructor, research method), utility functions (frontmatter parsing, title extraction, category inference), statistics tracking, error handling scenarios, and result formatting validation.