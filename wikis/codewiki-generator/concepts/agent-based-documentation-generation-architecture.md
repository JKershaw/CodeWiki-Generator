---
title: Agent-based documentation generation architecture
category: concept
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# GuideGenerationAgent

## Purpose and Overview

The GuideGenerationAgent implements an agent-based architecture pattern for transforming wiki content into operational documentation guides. This specialized agent encapsulates the complex workflow of analyzing repository characteristics and generating context-aware documentation through LLM integration.

## Key Functionality

The GuideGenerationAgent orchestrates a multi-step pipeline that combines several key capabilities:

- **Repository Introspection**: Automatically detects project characteristics including test frameworks, CI/CD configurations, package managers, TypeScript usage, and Docker setup
- **Wiki Content Processing**: Formats and structures existing wiki content for optimal guide generation
- **LLM Integration**: Interfaces with Claude API to generate comprehensive guides based on repository context and wiki content
- **Content Validation**: Implements JSON parsing and structural validation to ensure generated guides meet quality standards
- **Context-Aware Generation**: Tailors documentation output to reflect actual project setup and tooling discovered through repository analysis

The agent follows a systematic approach: wiki structure formatting → repository info detection → prompt rendering → LLM invocation → JSON parsing → validation.

## Relationships

The GuideGenerationAgent operates as part of a broader agent-based documentation generation architecture, serving as a specialized component that:

- Consumes wiki content from the broader documentation system
- Interfaces with external LLM services (Claude API) for content generation
- Provides generated guides back to the documentation pipeline
- Relies on repository analysis utilities to gather contextual information

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();
const guide = await agent.generateGuide(wikiContent, repositoryPath);
```

## Testing

No automated tests found for this component.