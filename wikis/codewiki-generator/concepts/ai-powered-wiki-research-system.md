---
title: AI-powered wiki research system
category: concept
sourceFile: wiki-context.js
related: []
created: 2025-11-23
updated: 2025-11-23
---

# AI-powered wiki research system

## Purpose and Overview

The AI-powered wiki research system provides intelligent context extraction from documentation wikis using AI agents to analyze and synthesize relevant information for specific development tasks. This system transforms static documentation into a queryable knowledge base that can automatically surface relevant context, examples, and guidance based on task descriptions.

## Key Functionality

The system operates through several core components:

- **Wiki Content Scanning**: Recursively scans wiki directories to collect all markdown files with their metadata and frontmatter
- **AI-Powered Analysis**: Uses Claude AI to analyze wiki content and extract task-relevant information based on developer queries
- **Structured Context Extraction**: Categorizes and organizes findings into different types of context (implementation details, examples, best practices, etc.)
- **CLI Interface**: Provides a command-line interface for developers to request specific research from their documentation

The `WikiContextCLI` class orchestrates the entire process, from scanning wiki files through the `getAllPages` function to coordinating AI analysis via the `research` function. The system constructs structured prompts for the AI agent and parses responses into actionable research results.

## Relationships

This component integrates with several other system elements:

- **ClaudeClient**: Depends on the Claude AI client for performing intelligent analysis of wiki content
- **Wiki Structure**: Integrates seamlessly with existing markdown-based wiki organization and frontmatter metadata
- **Development Workflow**: Provides an intelligent layer over static documentation systems to support active development tasks

The system respects existing wiki file structures and metadata conventions while adding AI-powered capabilities on top.

## Usage Example

```javascript
const WikiContextCLI = require('./wiki-context.js');

// Initialize the wiki context research system
const wikiCLI = new WikiContextCLI();

// Research context for a specific development task
const results = await wikiCLI.research("implementing user authentication");

// Results are automatically formatted for display
console.log(results);
```

## Testing

No automated tests are currently available for this component. Testing would benefit from coverage of wiki content parsing, AI prompt construction, and response validation functionality.