---
title: Wiki-sourced content generation
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki-Sourced Content Generation

## Purpose and Overview

The `GuideGenerationAgent` orchestrates the automatic generation of operational guides from wiki data by analyzing repository characteristics and delegating guide creation to Claude AI. It serves as a key component in a multi-agent documentation system that transforms wiki concepts and components into tailored, structured guides without manual intervention.

## Key Functionality

### Main Capabilities

- **Guide Generation**: Accepts wiki data (concepts and components) and generates operational guides through AI processing
- **Repository Introspection**: Detects project characteristics including test frameworks, CI/CD pipelines, package managers, Docker presence, and TypeScript usage
- **Context-Aware Documentation**: Combines detected repository info with wiki content to produce guides tailored to the actual project structure
- **Structured Output Validation**: Validates JSON responses from Claude to ensure guides conform to expected structure

### How It Works

1. **Input Processing**: Accepts wiki structure containing concepts and components
2. **Repository Analysis**: Scans file structure via `detectRepositoryInfo()` to identify project metadata
3. **Format Conversion**: Transforms wiki data and repository info into human-readable text via `_formatWikiStructure()` and `_formatRepositoryInfo()`
4. **AI Delegation**: Sends formatted context and prompt template to Claude API via ClaudeClient
5. **Response Validation**: Validates and returns the structured guide output

The agent uses PromptManager to render templates with injected context, enabling flexible prompt construction while maintaining consistency across the documentation pipeline.

## Relationships

- **ClaudeClient**: Handles API communication for AI-powered guide generation
- **PromptManager**: Renders prompt templates with injected wiki and repository context
- **Multi-Agent System**: Operates as a sibling component alongside other documentation agents (e.g., concept agents, component agents)
- **Wiki Data**: Consumes structured wiki metadata as input for knowledge base integration
- **Repository Structure**: Analyzes project files to extract contextual information for guide customization

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();

const wikiData = {
  concepts: [
    { name: 'Authentication', description: 'User identity verification' }
  ],
  components: [
    { name: 'AuthService', description: 'Handles auth logic' }
  ]
};

const guides = await agent.generateGuides(wikiData);
console.log(guides);
```

## Testing

No automated test coverage is currently available for this component. When contributing improvements, ensure that:
- Guide generation produces valid JSON output matching the expected structure
- Repository introspection correctly identifies all supported project characteristics
- Prompt rendering properly injects wiki and repository context without breaking template syntax