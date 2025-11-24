---
title: Structured wiki content analysis
category: component
sourceFile: wiki-context.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Structured Wiki Content Analysis

## Purpose and Overview

The structured wiki content analysis component provides AI-powered research capabilities for extracting task-relevant context from documentation. It systematically scans wiki content, analyzes it using AI agents, and delivers structured insights to developers working on specific tasks.

## Key Functionality

The `WikiContextCLI` class orchestrates the entire research process:

- **Content Discovery**: Recursively scans wiki directories to collect all markdown files with their metadata using `getAllPages()`
- **Metadata Extraction**: Parses frontmatter and infers content categories based on file structure through `extractMetadata()` and `inferCategory()`
- **AI Research Coordination**: Uses the `research()` method to send structured prompts to AI agents for intelligent content analysis
- **Response Processing**: Validates and parses AI responses through `parseResponse()` and formats results into readable output via `formatResults()`
- **Prompt Engineering**: Constructs targeted research prompts using `buildResearchPrompt()` that combine task descriptions with relevant wiki content

The system transforms static documentation into an intelligent, queryable knowledge base that can provide contextual insights for development tasks.

## Relationships

- **Depends on ClaudeClient**: Integrates with AI service for content analysis and research capabilities
- **Wiki Integration**: Works with existing markdown-based wiki structures and preserves frontmatter metadata
- **CLI Interface**: Provides command-line access for developers to request task-specific documentation context
- **Documentation Layer**: Acts as an intelligent overlay on static documentation systems, enhancing discoverability and relevance

## Usage Example

```javascript
const WikiContextCLI = require('./wiki-context.js');

const wikiCLI = new WikiContextCLI();
const taskDescription = "implementing user authentication";
const results = await wikiCLI.research(taskDescription);
console.log(wikiCLI.formatResults(results));
```

## Testing

No automated tests are currently available for this component. Test coverage should be implemented to validate AI prompt construction, response parsing, and metadata extraction functionality.