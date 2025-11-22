---
title: GuideGenerationAgent
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# GuideGenerationAgent

## Purpose and Overview

The GuideGenerationAgent automatically transforms existing wiki documentation into actionable operational guides by analyzing repository structure and leveraging AI processing. It bridges the gap between conceptual documentation and practical implementation by generating step-by-step procedures tailored to the actual technology stack in use.

## Key Functionality

### Guide Generation Workflow

The agent operates through a coordinated process:

1. **Repository Analysis** - `detectRepositoryInfo()` recursively scans the codebase using `scanDir()` to identify technologies, frameworks, build tools, and infrastructure patterns
2. **Content Processing** - Formats wiki components and concepts into structured input for AI analysis
3. **AI-Powered Generation** - Uses Claude AI with specialized prompts to create operational guides based on detected repository characteristics
4. **Structured Output** - Returns guides in standardized JSON format for integration with existing documentation workflows

### Repository Introspection

The `detectRepositoryInfo` method provides intelligent codebase analysis by:
- Detecting programming languages and frameworks from file patterns
- Identifying build tools, package managers, and dependency configurations  
- Recognizing infrastructure setup (Docker, Kubernetes, cloud configs)
- Finding testing frameworks and CI/CD pipeline definitions

This contextual awareness enables generation of guides specific to the actual technology stack rather than generic documentation.

### Core Integration Points

- **`generateWikiGuides()`** - Main orchestration function that coordinates the complete guide generation process from wiki analysis through final output
- **`generateGuides(wikiData, repositoryPath)`** - Core processing engine that combines wiki content with repository context for AI generation
- **`detectRepositoryInfo(repositoryPath)`** - Standalone repository analysis that can inform other documentation processes

## Relationships

The GuideGenerationAgent integrates seamlessly with the existing documentation ecosystem:

- **Agent Architecture** - Extends the established agent-based pattern used by other documentation processors, sharing initialization and error handling conventions
- **Wiki Workflow Integration** - Operates after initial documentation generation but before index creation, consuming the same structured wiki format produced by other agents
- **Shared Infrastructure** - Leverages ClaudeClient for AI processing and PromptManager for template-based prompt engineering
- **Content Categorization** - Works with the existing component/concept separation established by other documentation agents to generate targeted operational procedures

## Usage Examples

### Complete Guide Generation

```javascript
const agent = new GuideGenerationAgent();
const guides = await agent.generateWikiGuides(wikiData, repositoryPath);
// Returns structured guides based on wiki content + repo analysis
```

### Repository Analysis for Context

```javascript
const repoInfo = await agent.detectRepositoryInfo('/path/to/repo');
console.log(repoInfo.languages);   // ['JavaScript', 'TypeScript'] 
console.log(repoInfo.frameworks);  // ['React', 'Node.js']
console.log(repoInfo.tools);       // ['Docker', 'Jest', 'Webpack']
```

The generated guides transform static wiki documentation into dynamic operational knowledge that teams can immediately apply for implementation, deployment, and maintenance tasks.