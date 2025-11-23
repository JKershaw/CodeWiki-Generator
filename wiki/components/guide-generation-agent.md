---
title: GuideGenerationAgent
category: component
related: []
created: 2025-11-23
updated: 2025-11-23
---

# GuideGenerationAgent

## Purpose and Overview

The GuideGenerationAgent transforms descriptive wiki content into actionable operational guides using AI-powered content generation. It bridges the gap between static documentation and practical step-by-step instructions by analyzing both wiki structure and repository characteristics to create contextually relevant guides.

## Key Functionality

### Guide Generation
- Processes structured wiki data to identify actionable content patterns
- Uses Claude AI to transform descriptive content into step-by-step operational procedures
- Generates guides tailored to specific project contexts and technology stacks

### Repository Analysis
- **[Repository fingerprinting](../concepts/repository-fingerprinting.md)**: Automatically detects project characteristics from file structure
- Identifies technology stack, frameworks, and development tools
- Customizes guide generation based on detected project conventions and tooling

### Content Processing
- Formats wiki structure into prompt-consumable text via `_formatWikiStructure()`
- Converts repository analysis results into human-readable context via `_formatRepositoryInfo()`
- Integrates structured data with LLM prompts for coherent guide generation

## Relationships

- **Extends agent architecture**: Built on the existing agent-based pattern for consistent system integration
- **LLM integration**: Uses ClaudeClient for AI-powered content transformation
- **Template management**: Leverages PromptManager for structured prompt construction and reusability
- **Wiki system integration**: Consumes data from the existing wiki management infrastructure
- **Documentation pipeline**: Forms a key component in the broader documentation automation workflow

## Usage Examples

### Basic Guide Generation
```javascript
const agent = new GuideGenerationAgent();
const guides = await agent.generateGuides(wikiData, repositoryPath);
```

### With Repository Analysis
```javascript
const repoInfo = await agent.detectRepositoryInfo('/path/to/project');
const contextualGuides = await agent.generateGuides(wikiData, repoInfo);
```

The agent automatically combines wiki content structure with repository context to produce guides that reflect actual project setup and conventions, making generated procedures immediately applicable to the specific codebase.