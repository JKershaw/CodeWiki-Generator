---
title: Operational documentation generation
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Operational Documentation Generation

The operational documentation generation system automatically transforms descriptive wiki content into actionable procedural guides. This bridges the gap between static documentation and executable instructions by analyzing both wiki structure and repository characteristics to produce context-aware operational guides.

## Key Functionality

### Guide Generation Process

The `GuideGenerationAgent` serves as the core orchestrator, combining multiple data sources to create comprehensive operational guides:

- **Wiki Content Analysis**: Processes existing wiki pages and structure to understand documented concepts, procedures, and relationships
- **Repository Fingerprinting**: Automatically detects technology stack, tools, and project conventions by analyzing file patterns and project structure
- **LLM-Powered Synthesis**: Uses Claude AI to transform the combined context into structured, actionable guides tailored to the specific repository

### Repository Detection

The `detectRepositoryInfo` function implements intelligent repository fingerprinting by scanning for characteristic files and patterns:

- Framework detection (package.json, requirements.txt, etc.)
- Build tool identification (Makefile, docker-compose.yml, etc.)
- CI/CD pipeline recognition
- Development environment indicators

This contextual information ensures generated guides reference the actual tools and patterns used in the target repository.

### Content Formatting

Wiki data and repository information undergo structured formatting through `_formatWikiStructure` and `_formatRepositoryInfo` functions, creating optimized inputs for prompt templates that guide the LLM generation process.

## Relationships

- **Extends Agent Architecture**: Built on the existing agent pattern using `ClaudeClient` for LLM interactions
- **Integrates with Wiki System**: Consumes structured wiki data from the broader documentation management pipeline
- **Uses Template System**: Leverages `PromptManager` for consistent prompt construction and template management
- **Repository Analysis**: Works alongside repository scanning capabilities to provide comprehensive project context

## Usage Examples

```javascript
const agent = new GuideGenerationAgent(claudeClient, promptManager);

// Generate guides for a repository with wiki context
const guides = await agent.generateGuides(wikiData, repositoryPath);

// Direct repository analysis
const repoInfo = await agent.detectRepositoryInfo('/path/to/project');
```

The generated guides automatically incorporate repository-specific details, ensuring instructions reference actual configuration files, scripts, and tools present in the target environment rather than generic placeholders.