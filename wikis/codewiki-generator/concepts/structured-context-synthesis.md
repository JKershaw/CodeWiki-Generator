---
title: Structured context synthesis
category: concept
sourceFile: lib/wiki-context-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Structured Context Synthesis

## Purpose and Overview

The Structured Context Synthesis component provides AI-powered research capabilities for wiki content, transforming unstructured documentation into actionable development guidance. It analyzes wiki pages semantically rather than through simple keyword matching, delivering relevant context, components, and implementation steps for specific development tasks.

## Key Functionality

**Core Research Process:**
- Retrieves all wiki pages with full content and metadata
- Constructs detailed AI prompts combining task descriptions with wiki content
- Uses AI analysis to identify relevant documentation and extract structured insights
- Returns formatted results with summaries, related pages, components, and guidance

**Content Processing:**
- Parses YAML frontmatter from markdown files for metadata extraction
- Handles various wiki page formats and structures
- Validates and processes AI responses with error handling for malformed JSON
- Maintains statistics on research operations and costs

**Output Structure:**
- Summary of relevant information for the query
- List of related wiki pages with relevance explanations
- Identified components and concepts
- Step-by-step implementation guidance

## Relationships

- **WikiManager**: Accesses wiki content and page structure
- **ClaudeClient**: Integrates AI analysis capabilities for semantic understanding
- **Wiki System**: Extends basic wiki functionality with intelligent querying
- **Development Tools**: Provides structured output for dashboards and development assistance

## Usage Example

```javascript
const WikiContextService = require('./lib/wiki-context-service');

// Initialize with wiki configuration
const service = new WikiContextService({
  wikiBasePath: './wiki',
  claudeClient: mockClaudeClient
});

// Research development context
const results = await service.research(
  'implementing user authentication',
  'my-project'
);

// Access structured results
console.log(results.summary);
console.log(results.pages);
console.log(results.components);
console.log(results.guidance);
```

## Testing

**Test Coverage**: tests/unit/wiki-context-service.test.js
- **31 test cases** across **10 test suites**
- **Test Categories**: 
  - Core WikiContextService functionality
  - Constructor validation and configuration
  - Research method with various scenarios
  - Content parsing (_parseFrontmatter, _getTitleFromPath, _inferCategory)
  - Statistics tracking (getStatistics, resetStatistics)
  - Error handling for malformed responses
  - Result formatting (_formatResults)