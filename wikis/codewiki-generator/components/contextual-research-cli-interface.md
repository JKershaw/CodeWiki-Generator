---
title: Contextual research CLI interface
category: component
sourceFile: wiki-context.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Contextual Research CLI Interface

## Purpose and Overview

The Contextual research CLI interface provides a command-line tool that leverages AI to extract task-specific context from wiki documentation. It enables developers to query their documentation repository and receive intelligent, synthesized information relevant to their current development tasks.

## Key Functionality

The `WikiContextCLI` class orchestrates the entire research process:

- **Wiki Content Discovery**: Recursively scans the wiki directory using `getAllPages()` to collect all markdown files with their metadata
- **Metadata Extraction**: Parses frontmatter from markdown files and infers categories based on file path structure
- **AI-Powered Analysis**: Uses the `research()` method to coordinate with Claude AI for intelligent content analysis
- **Structured Output**: Formats research results into readable sections categorizing different types of contextual information

The system constructs structured prompts for the AI agent through `buildResearchPrompt()`, validates JSON responses with `parseResponse()`, and presents results in a human-readable format via `formatResults()`.

## Relationships

- **Depends on ClaudeClient**: Integrates with AI service for intelligent content analysis and synthesis
- **Wiki Integration**: Works with existing markdown-based wiki structure, preserving frontmatter metadata
- **Documentation Layer**: Provides an intelligent interface over static documentation systems without requiring changes to existing content structure

## Usage Example

```javascript
const WikiContextCLI = require('./wiki-context');

// Initialize the CLI interface
const wikiCLI = new WikiContextCLI();

// Research task-specific context
const taskDescription = "implementing user authentication";
const results = await wikiCLI.research(taskDescription);

// Results are automatically formatted for display
console.log(results);
```

## Testing

No automated tests are currently available for this component.