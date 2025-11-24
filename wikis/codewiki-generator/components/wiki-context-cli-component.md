---
title: WikiContextCLI component
category: component
sourceFile: wiki-context.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiContextCLI Component

## Purpose and Overview

The WikiContextCLI component provides AI-powered analysis of wiki documentation to extract relevant context for development tasks. It scans markdown-based wiki pages, sends structured content to an AI agent, and generates intelligent research reports that help developers understand existing codebase patterns and documentation.

## Key Functionality

The component operates through several coordinated processes:

- **Wiki Scanning**: Recursively discovers and parses all markdown files in the wiki directory, extracting metadata and content structure
- **AI Research Orchestration**: Constructs detailed prompts containing task descriptions and relevant wiki content, then coordinates with Claude AI for intelligent analysis
- **Response Processing**: Validates and parses structured JSON responses from the AI agent to ensure reliable output
- **Report Generation**: Formats AI insights into human-readable research reports with actionable development guidance

The system builds comprehensive prompts that include both the user's task description and contextual wiki content, enabling the AI to provide targeted recommendations based on existing documentation patterns.

## Relationships

- **Depends on ClaudeClient** from `./lib/claude` for AI processing capabilities
- **Integrates with wiki structure** by reading markdown files and preserving existing documentation format
- **Extends documentation toolchain** as an intelligent layer above static wiki content for context-aware development assistance

## Usage Example

```javascript
const WikiContextCLI = require('./wiki-context');

// Initialize with wiki directory path
const wikiContext = new WikiContextCLI('./wiki');

// Research a development task
const results = await wikiContext.research('How to implement user authentication');

// Format and display results
const formattedReport = wikiContext.formatResults(results);
console.log(formattedReport);
```

## Testing

No automated tests are currently available for this component.