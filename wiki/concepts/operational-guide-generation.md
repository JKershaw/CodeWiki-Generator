---
title: Operational guide generation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Operational Guide Generation

## Purpose and Overview

The operational guide generation system automatically converts wiki documentation into actionable guides tailored to specific repositories. It combines repository introspection with AI processing to create context-aware documentation that helps teams understand how to work with their codebase effectively.

## Key Functionality

### Guide Generation Process

The `GuideGenerationAgent` orchestrates the generation workflow:

1. **Repository Analysis** - Detects technologies, frameworks, and tooling by scanning file patterns and configurations
2. **Wiki Processing** - Formats existing wiki components and concepts into structured input
3. **AI Generation** - Uses Claude AI with specialized prompts to generate operational guides
4. **Output Formatting** - Returns structured JSON with generated guide content

### Repository Introspection

The `detectRepositoryInfo` function automatically identifies:
- Programming languages and frameworks
- Build tools and configuration files
- Testing frameworks and CI/CD setup
- Documentation patterns and project structure

This context ensures generated guides are relevant to the actual codebase rather than generic.

### Template-Driven Generation

Guide generation relies on prompt templates managed through the `PromptManager`. Templates can be customized to produce different types of operational guides based on team needs and repository characteristics.

## Relationships

### System Integration

- **Extends Agent Architecture** - Follows the established agent pattern with Claude AI integration
- **Consumes Wiki Data** - Processes the same structured wiki data used by other documentation agents
- **Uses Prompt Management** - Leverages the centralized template system for consistent AI interactions
- **Outputs Standard Format** - Generates JSON following system-wide data conventions

### Dependencies

- `ClaudeClient` for AI processing
- `PromptManager` for template rendering
- Wiki data structure from the broader documentation system

## Usage Examples

### Basic Guide Generation

```javascript
const agent = new GuideGenerationAgent(claudeClient, promptManager);
const guides = await agent.generateGuides(wikiData, repositoryPath);
```

### Custom Repository Context

The agent automatically detects repository characteristics, but the detection logic can be extended for specialized frameworks or tooling patterns not covered by the default implementation.

### Template Customization

Teams can create specialized prompt templates for domain-specific operational guides by working with the `PromptManager` system to define new generation templates.