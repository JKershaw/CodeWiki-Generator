---
title: Agent-based documentation synthesis
category: concept
sourceFile: lib/agents/architecture-overview-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Architecture Overview Agent

## Purpose and Overview

The `ArchitectureOverviewAgent` generates comprehensive system architecture documentation by synthesizing multiple documentation categories (concepts, components, and guides) into cohesive, AI-powered summaries. It serves as a specialized agent that aggregates heterogeneous wiki data and uses Claude AI to produce unified architecture documentation suitable for project wikis and README files.

## Key Functionality

The agent implements a multi-stage pipeline for documentation synthesis:

- **Data Aggregation**: Collects structured wiki data from three documentation categories—concepts, components, and guides—normalizing each into consistent list representations
- **Prompt Rendering**: Uses the `PromptManager` to render the 'architecture-overview' template with formatted wiki data injected as context
- **AI Synthesis**: Invokes Claude API to generate coherent, system-level architecture narratives that connect individual documentation elements into a unified story
- **Output Normalization**: Post-processes Claude's markdown response to remove code block wrappers and frontmatter, ensuring clean, production-ready documentation

### Internal Methods

- `_formatConcepts()`, `_formatComponents()`, `_formatGuides()`: Private methods that transform raw wiki structures into prompt-injectable lists
- `_cleanMarkdown()`: Strips markdown code block wrappers (`~~~markdown`, ` ``` `) and YAML frontmatter from AI output
- `generateArchitectureOverview()`: Main orchestration method that chains the above operations

## Relationships

| Component | Role |
|-----------|------|
| **ClaudeClient** | Provides AI-powered content generation via API |
| **PromptManager** | Renders 'architecture-overview' prompt template |
| **Wiki Data** | Consumes structured concepts, components, and guides |
| **Agent Pattern** | Follows established patterns in `lib/agents/` |

The agent is designed to work within a documentation pipeline, producing markdown output (e.g., `architecture.md`) from aggregated wiki sources.

## Usage Example

```javascript
const ArchitectureOverviewAgent = require('./lib/agents/architecture-overview-agent');
const claudeClient = require('./lib/clients/claude-client');
const promptManager = require('./lib/managers/prompt-manager');

const agent = new ArchitectureOverviewAgent(claudeClient, promptManager);

const wikiData = {
  concepts: [{ name: 'MVC Pattern', description: '...' }],
  components: [{ name: 'UserController', purpose: '...' }],
  guides: [{ title: 'Getting Started', content: '...' }]
};

const architectureDoc = await agent.generateArchitectureOverview(wikiData);
console.log(architectureDoc); // Clean markdown suitable for documentation
```

## Testing

No automated tests are currently available for this component. When adding tests, focus on:
- Data formatting correctness across all three wiki categories
- Markdown cleaning logic (code block and frontmatter removal)
- Integration with ClaudeClient and PromptManager mocks
- Handling of edge cases (empty categories, malformed wiki data)