---
title: AI-powered contextual documentation research
category: concept
sourceFile: lib/wiki-context-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiContextService

**Purpose and Overview**
The WikiContextService provides AI-powered contextual documentation research that analyzes wiki content to deliver relevant context for development tasks. It uses semantic understanding rather than simple keyword matching to identify and synthesize documentation that can guide development decisions and implementation approaches.

## Key Functionality

The service performs intelligent analysis of wiki documentation through several key operations:

- **Contextual Research**: Takes a query and project name, analyzes all wiki pages using AI, and returns structured context relevant to the development task
- **Content Analysis**: Retrieves and processes all wiki pages including frontmatter metadata extraction and content parsing
- **AI Integration**: Constructs detailed prompts for AI analysis and handles response parsing with error recovery
- **Structured Output**: Transforms AI responses into consistent formats with summaries, relevant pages, components, and implementation guidance

The core workflow involves gathering all wiki content, building comprehensive research prompts, querying the AI service, and formatting results into actionable development context.

## Relationships

- **Depends on WikiManager** for accessing and retrieving wiki content and metadata
- **Integrates with ClaudeClient** for AI-powered semantic analysis and context generation
- **Extends the wiki system** by adding intelligent querying capabilities beyond basic search
- **Provides structured output** consumed by dashboard interfaces and development tools

## Usage Example

```javascript
const WikiContextService = require('./lib/wiki-context-service');

// Initialize service with wiki base path
const service = new WikiContextService({
  wikiBasePath: './docs/wiki'
});

// Research context for a development task
const context = await service.research(
  'implementing user authentication',
  'my-project'
);

// Access structured results
console.log(context.summary);
console.log(context.components);
console.log(context.guidance);
```

## Testing

**Test Coverage**: `tests/unit/wiki-context-service.test.js`
- 31 test cases across 10 test suites
- Comprehensive coverage including constructor, core research functionality, frontmatter parsing, statistics tracking, error handling, and response formatting
- Tests validate AI integration, content processing, and structured output generation