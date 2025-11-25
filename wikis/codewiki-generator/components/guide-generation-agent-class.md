---
title: GuideGenerationAgent class
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: [meta/overview.md, concepts/agent-based-architecture.md]
created: 2025-11-25
updated: 2025-11-25
---

# GuideGenerationAgent

## Purpose and [Overview](../meta/overview.md)

The GuideGenerationAgent is a specialized AI-powered agent that transforms wiki content into operational guides for development workflows. It leverages repository introspection to automatically detect project characteristics and enrich guide generation with contextual information, eliminating the need for manual configuration.

## Key Functionality

The GuideGenerationAgent provides two core capabilities:

- **Guide Generation**: Transforms raw wiki data into structured operational guides using Claude API interaction, with prompt rendering and response validation to ensure structured JSON output
- **Repository Context Detection**: Automatically analyzes the repository file structure to identify testing frameworks, CI/CD systems, package managers, Docker usage, and TypeScript presence through the `detectRepositoryInfo` method

The agent follows a modular architecture pattern where it encapsulates specific AI-powered transformation tasks, handling the complete pipeline from content input to validated guide output.

## Relationships

This component is part of the broader [agent-based architecture](../concepts/agent-based-architecture.md) within the `lib/agents/` directory. It connects to:

- **Claude API**: External AI service for content transformation
- **Repository file system**: Reads project structure for context detection
- **Wiki content system**: Consumes wiki data as input for guide generation
- **Prompt rendering system**: Processes templates for AI interaction

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();

// Detect repository characteristics for context
const repoInfo = agent.detectRepositoryInfo();

// Generate operational guide from wiki content
const guide = await agent.generateGuide(wikiData, repoInfo);
```

## Testing

No automated tests are currently available for this component.