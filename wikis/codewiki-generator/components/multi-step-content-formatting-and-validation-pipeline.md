---
title: Multi-step content formatting and validation pipeline
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Multi-step content formatting and validation pipeline

## Purpose and Overview

The multi-step content formatting and validation pipeline provides a systematic approach for transforming wiki content into high-quality operational guides. It combines wiki structure formatting, repository analysis, LLM-based content generation, and validation to ensure generated guides meet quality standards and reflect actual project characteristics.

## Key Functionality

The pipeline operates through several coordinated steps:

- **Wiki Content Processing**: Formats and structures existing wiki content as input for guide generation
- **Repository Introspection**: Automatically detects project characteristics including test frameworks, CI/CD configurations, package managers, TypeScript usage, and Docker setup
- **Context-Aware Generation**: Uses detected repository information to tailor generated guides to the specific project environment
- **LLM Integration**: Leverages Claude API through prompt rendering and invocation to generate contextually relevant documentation
- **Validation Pipeline**: Performs JSON parsing and structural validation to ensure generated guides conform to expected formats and quality standards

The pipeline ensures that documentation reflects the actual technology stack and setup of the target repository, rather than providing generic guidance.

## Relationships

This pipeline is the core component of the **GuideGenerationAgent class** in the agent-based documentation generation architecture. It serves as the orchestration layer that coordinates:

- Wiki content sources and formatting utilities
- Repository analysis tools for detecting project characteristics  
- LLM service integrations (Claude API)
- Content validation and quality assurance components

The pipeline pattern enables modular, testable documentation generation where each step can be independently verified and improved.

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();
const wikiContent = { /* structured wiki data */ };
const repositoryPath = './project-root';

const guide = await agent.generateGuide(wikiContent, repositoryPath);
```

## Testing

No automated tests found for this component.