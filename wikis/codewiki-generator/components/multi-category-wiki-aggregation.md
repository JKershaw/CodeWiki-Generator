---
title: Multi-category wiki aggregation
category: component
sourceFile: lib/agents/architecture-overview-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Architecture Overview Agent

## Purpose and Overview

The Architecture Overview Agent is a specialized AI-powered component that synthesizes multi-category wiki data (concepts, components, and guides) into coherent, system-level architecture documentation. It uses Claude AI to intelligently integrate heterogeneous documentation sources and produce unified markdown output suitable for project architecture documentation, establishing a reusable pattern for high-level documentation generation.

## Key Functionality

The agent orchestrates the following workflow:

- **Data Aggregation**: Collects and formats three distinct documentation categories—concepts, components, and guides—from structured wiki data
- **Normalization**: Private formatting methods (`_formatConcepts`, `_formatComponents`, `_formatGuides`) normalize heterogeneous data structures into consistent list representations for consistent prompt injection
- **AI-Powered Synthesis**: Invokes Claude AI via the PromptManager's 'architecture-overview' template to synthesize aggregated documentation into coherent architectural narrative
- **Output Cleaning**: Post-processes Claude's response with `_cleanMarkdown` to remove markdown code block wrappers and frontmatter, ensuring clean, production-ready documentation

The main entry point is `generateArchitectureOverview()`, which orchestrates data formatting, prompt rendering, API invocation, and output normalization into a single operation.

## Relationships

- **ClaudeClient**: Provides AI-powered content generation capabilities
- **PromptManager**: Manages the 'architecture-overview' prompt template used for synthesis instructions
- **Agent Pattern**: Follows the established agent architecture pattern used throughout `lib/agents/`
- **Wiki Data Sources**: Consumes structured wiki data from concepts, components, and guides repositories
- **Output Target**: Generates markdown output intended for architecture documentation files (e.g., `architecture.md`)

## Usage Example

```javascript
const ArchitectureOverviewAgent = require('./lib/agents/architecture-overview-agent');

const agent = new ArchitectureOverviewAgent();

const wikiData = {
  concepts: [{ name: 'Agent pattern', description: '...' }],
  components: [{ name: 'ClaudeClient', purpose: '...' }],
  guides: [{ title: 'Getting started', content: '...' }]
};

const overview = await agent.generateArchitectureOverview(wikiData);
console.log(overview); // Clean markdown documentation
```

## Testing

No automated test coverage is currently available for this component. Test coverage should focus on:
- Prompt formatting and parameter passing to Claude API
- Output normalization for various Claude response formats
- Handling of edge cases in multi-category data aggregation