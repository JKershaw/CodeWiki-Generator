---
title: Structured wiki intelligence system
category: concept
sourceFile: wiki-context.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiContextCLI

## Purpose and Overview

WikiContextCLI is an AI-powered research tool that intelligently analyzes wiki documentation to provide relevant context for development tasks. It scans markdown wiki pages, extracts metadata, and leverages AI to synthesize targeted insights based on specific task descriptions.

## Key Functionality

The system operates through several coordinated components:

- **Wiki Scanning**: Recursively discovers and parses all markdown pages in the wiki directory, extracting content and metadata
- **AI Research**: Uses Claude AI to analyze wiki content against specific task requirements, identifying relevant documentation sections
- **Structured Analysis**: Processes AI responses as structured JSON to ensure consistent, actionable insights
- **Report Generation**: Formats research findings into human-readable reports with clear recommendations

The tool bridges the gap between static documentation and dynamic development needs by providing context-aware documentation discovery.

## Relationships

- **Integrates with ClaudeClient** (`./lib/claude`) for AI-powered analysis capabilities
- **Operates on existing wiki structure** using standard markdown format with frontmatter metadata
- **Extends documentation toolchain** by adding intelligent context extraction to complement static wiki browsing

## Usage Example

```javascript
const WikiContextCLI = require('./wiki-context');

const cli = new WikiContextCLI({
  wikiPath: './wiki',
  aiClient: claudeClient
});

// Research context for a specific development task
const results = await cli.research("implementing user authentication system");
console.log(cli.formatResults(results));
```

Command line usage:
```bash
node wiki-context.js "implementing user authentication system"
```

## Testing

No automated tests are currently available for this component. Testing would benefit from mocking AI responses and validating wiki parsing functionality.