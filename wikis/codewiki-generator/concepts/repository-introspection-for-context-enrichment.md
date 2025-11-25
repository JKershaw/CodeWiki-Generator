---
title: Repository introspection for context enrichment
category: concept
sourceFile: lib/agents/guide-generation-agent.js
related: [meta/overview.md, concepts/agent-based-documentation-generation.md]
created: 2025-11-25
updated: 2025-11-25
---

# Repository Introspection for Context Enrichment

## Purpose and [Overview](../meta/overview.md)

Repository introspection for context enrichment automatically analyzes a codebase's file structure to detect key characteristics like testing frameworks, CI/CD systems, package managers, and technology usage. This pattern enriches AI-powered guide generation by providing contextual repository information without requiring manual configuration.

## Key Functionality

The introspection system scans repository files to identify:

- **Testing frameworks** - Detects presence of Jest, Mocha, Cypress, and other testing tools
- **CI/CD systems** - Identifies GitHub Actions, Jenkins, CircleCI configuration files
- **Package managers** - Recognizes npm, yarn, pnpm through lockfiles and configuration
- **Technology stack** - Discovers TypeScript usage, Docker containers, and development tools
- **Project structure** - Analyzes file patterns to understand project organization

The detected metadata is automatically incorporated into guide generation prompts, ensuring that generated documentation includes relevant, repository-specific context and recommendations.

## Relationships

This concept is implemented within the `GuideGenerationAgent` class as the `detectRepositoryInfo` method. It serves as a preprocessing step that enriches the context before AI prompt generation, working alongside:

- **GuideGenerationAgent** - Uses repository metadata to enhance guide generation quality
- **[Agent-based documentation generation](../concepts/agent-based-documentation-generation.md)** - Provides contextual data as part of the agent's transformation process
- **File system analysis** - Relies on repository file structure scanning capabilities

## Usage Example

```javascript
const GuideGenerationAgent = require('./lib/agents/guide-generation-agent');

const agent = new GuideGenerationAgent();
const repoInfo = agent.detectRepositoryInfo('/path/to/repository');

// Repository context automatically enriches guide generation
const guide = await agent.generateGuide(wikiContent, repoInfo);
```

## Testing

No automated tests found for this functionality.