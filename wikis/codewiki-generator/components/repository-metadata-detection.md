---
title: Repository metadata detection
category: component
sourceFile: lib/agents/guide-generation-agent.js
related: [meta/overview.md, components/guide-generation-agent-class.md, concepts/agent-based-documentation-generation.md]
created: 2025-11-25
updated: 2025-11-25
---

# Repository Metadata Detection

## Purpose and [Overview](../meta/overview.md)

The repository metadata detection component automatically analyzes a codebase's file structure to identify key characteristics such as testing frameworks, CI/CD systems, package managers, and technology stack details. This contextual information enriches the guide generation process by providing relevant repository-specific details without requiring manual configuration.

## Key Functionality

The `detectRepositoryInfo` method examines the repository structure to identify:

- **Testing frameworks** - Detects presence of Jest, Mocha, Cypress, or other testing tools
- **CI/CD systems** - Identifies GitHub Actions, Jenkins, or other continuous integration setups
- **Package managers** - Recognizes npm, yarn, pnpm through lockfiles and configuration
- **Technology stack** - Detects TypeScript usage, Docker containers, and other development tools
- **Project structure** - Analyzes file patterns to understand project organization

The detection works by scanning for specific files, directories, and configuration patterns that indicate the presence of these technologies, building a comprehensive metadata profile of the repository.

## Relationships

This component is integrated within the **[GuideGenerationAgent class](../components/guide-generation-agent-class.md)** as a supporting method that enriches the context passed to AI models. It connects to:

- **[Agent-based documentation generation](../concepts/agent-based-documentation-generation.md)** - Provides contextual data that improves guide quality
- **Guide generation workflow** - Supplies repository-specific information during prompt rendering
- **Claude API interaction** - Enhances prompts with detected repository characteristics

The metadata detection supports the broader goal of creating more accurate and relevant operational guides by understanding the repository's technical environment.

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();
const repositoryInfo = agent.detectRepositoryInfo('/path/to/repository');

// repositoryInfo contains detected metadata about the repository
// Used internally during guide generation for context enrichment
```

## Testing

No automated tests found for this component.