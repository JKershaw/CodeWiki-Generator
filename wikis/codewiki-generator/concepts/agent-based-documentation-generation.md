---
title: Agent-based documentation generation
category: concept
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Guide Generation Agent

## Purpose and Overview

The Guide Generation Agent orchestrates the creation of operational guides from wiki data by analyzing repository characteristics and leveraging Claude AI to generate structured, context-aware documentation. It bridges the existing wiki knowledge base with AI-powered synthesis to produce guides tailored to specific project environments rather than generic templates.

## Key Functionality

**GuideGenerationAgent** is a class that handles the end-to-end process of generating operational guides:

- **Guide Generation**: The `generateGuides()` method accepts wiki data (concepts and components), formats it with repository context, sends it to Claude API via PromptManager templates, and returns validated guide structures in JSON format.

- **Repository Introspection**: The `detectRepositoryInfo()` method analyzes the file structure to identify project characteristics including:
  - Test frameworks (Jest, Mocha, etc.)
  - CI/CD pipelines (GitHub Actions, GitLab CI, etc.)
  - Package managers (npm, yarn, pnpm)
  - TypeScript support
  - Docker configuration

- **Wiki Structure Formatting**: The `_formatWikiStructure()` method converts wiki concepts and components into formatted text suitable for prompt injection, establishing a pattern where existing wiki content serves as the knowledge base for higher-order documentation.

- **Context Enrichment**: The `_formatRepositoryInfo()` method transforms detected repository metadata into human-readable format that provides contextual information to Claude during generation.

- **Response Validation**: Validates that Claude's JSON response conforms to the expected guide structure before returning results.

## Relationships

The Guide Generation Agent operates within a larger multi-agent documentation system:

- **ClaudeClient**: Communicates with Claude API for AI-powered generation
- **PromptManager**: Renders prompt templates with formatted wiki and repository data
- **Wiki Data Structure**: Consumes concepts and components as input for contextual generation
- **Sibling Agents**: Part of a coordinated multi-agent architecture for automated documentation

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();

const wikiData = {
  concepts: [{ name: 'Agent-based generation', category: 'concept' }],
  components: [{ name: 'ClaudeClient', category: 'component' }]
};

const guides = await agent.generateGuides(wikiData);
```

## Testing

No automated tests are currently available for this component. Contributors should validate the agent's output by:
- Confirming generated guides match expected structure
- Verifying repository detection accurately identifies project characteristics
- Testing with repositories of varying configurations (TypeScript, Docker, different CI systems)