---
title: Repository introspection for documentation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Repository Introspection for Documentation

## Purpose and Overview

Repository introspection automatically analyzes a codebase's structure and technologies to provide contextual information for documentation generation. This system examines file patterns, dependencies, and project structure to detect frameworks, languages, and tooling, enabling the creation of repository-specific operational guides.

## Key Functionality

### Technology Detection
- **File Pattern Analysis**: Scans for configuration files, package manifests, and framework-specific patterns
- **Framework Identification**: Detects common frameworks like React, Django, Docker, and build tools
- **Language Recognition**: Identifies primary programming languages and their ecosystems
- **Tooling Discovery**: Locates CI/CD configurations, testing frameworks, and deployment tools

### Context-Aware Documentation
- **Tailored Guide Generation**: Uses detected technologies to customize operational documentation
- **Repository-Specific Prompts**: Incorporates technology context into AI prompt generation
- **Structured Output**: Formats repository information for consumption by documentation agents

### Integration Points
```javascript
// Repository info is detected and formatted for prompt context
const repoInfo = await detectRepositoryInfo(repositoryPath);
const formattedContext = _formatRepositoryInfo(repoInfo);
```

## Relationships

### Agent Architecture Integration
- **GuideGenerationAgent**: Primary consumer that uses repository context for generating operational guides
- **PromptManager**: Receives formatted repository information as template variables
- **ClaudeClient**: Processes repository-aware prompts for more accurate documentation generation

### Data Flow
1. Repository structure is analyzed via `detectRepositoryInfo()`
2. Technology patterns are matched against known frameworks and tools
3. Results are formatted into human-readable context via `_formatRepositoryInfo()`
4. Context is integrated into guide generation prompts alongside wiki content
5. AI generates repository-specific operational documentation

### Wiki System Connection
- Complements existing wiki content with repository-specific technical context
- Enables transformation of general wiki knowledge into actionable, technology-specific guides
- Supports the broader goal of automated operational documentation generation

## Usage Examples

### Technology Detection Output
```json
{
  "languages": ["JavaScript", "Python"],
  "frameworks": ["React", "Django"],
  "tools": ["Docker", "GitHub Actions", "Jest"],
  "databases": ["PostgreSQL"],
  "deployment": ["Heroku", "AWS"]
}
```

### Integration with Guide Generation
The repository context enhances guide generation by providing specific technical details:
- Setup instructions tailored to detected package managers
- Framework-specific deployment procedures
- Technology-appropriate debugging and monitoring guidance