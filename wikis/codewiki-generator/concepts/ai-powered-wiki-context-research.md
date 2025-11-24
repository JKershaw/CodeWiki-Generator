---
title: AI-powered wiki context research
category: concept
sourceFile: wiki-context.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiContextCLI

## Purpose and Overview

The WikiContextCLI is an AI-powered command-line tool that intelligently analyzes wiki content to provide relevant context for development tasks. It goes beyond simple keyword matching to use semantic understanding for extracting actionable documentation, architectural patterns, and development guidance from your codebase wiki.

## Key Functionality

**Core Capabilities:**

- **Intelligent Wiki Analysis**: Recursively scans wiki directories and extracts metadata from markdown files with YAML frontmatter
- **AI-Powered Context Research**: Uses Claude AI to semantically analyze wiki content and synthesize relevant information for specific development tasks
- **Structured Response Processing**: Validates and parses AI responses into consistent, actionable research reports
- **Command-Line Interface**: Provides easy access to wiki intelligence through CLI arguments and formatted output

**How It Works:**

1. Scans the wiki directory structure to collect all markdown pages with metadata
2. Constructs detailed AI prompts combining the task description with relevant wiki content
3. Processes AI responses to extract components, patterns, and development guidance
4. Formats results into human-readable research reports with summaries and recommendations
5. Handles errors gracefully and provides helpful feedback for invalid responses

## Relationships

- **Depends on ClaudeClient**: Integrates with `./lib/claude` for AI-powered semantic analysis capabilities
- **Extends Wiki System**: Builds upon existing wiki structure and markdown documentation format
- **Complements Documentation Toolchain**: Adds intelligent context extraction layer to static documentation
- **Integrates with Development Workflow**: Provides context-aware assistance during development tasks

## Usage Example

```javascript
const WikiContextCLI = require('./wiki-context');

// Initialize CLI with wiki path
const cli = new WikiContextCLI('./docs/wiki');

// Research context for a development task
const results = await cli.research('implementing user authentication');

// Results contain structured analysis from AI
console.log(results.summary);
console.log(results.components);
console.log(results.guidance);

// CLI entry point for command-line usage
// node wiki-context.js "implementing user authentication"
```

## Testing

No automated tests are currently available for this component. Testing would benefit from coverage of wiki scanning functionality, AI prompt construction, response parsing, and CLI argument handling.