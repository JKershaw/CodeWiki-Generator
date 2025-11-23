---
title: Repository Analysis and Detection
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Repository Analysis and Detection

## Purpose and Overview

Repository Analysis and Detection automatically identifies project characteristics from file structure and contents to provide context-aware documentation generation. This pattern enables the Guide Generation Agent to create operational guides tailored to the specific frameworks, tools, and conventions used in a project.

## Key Functionality

The detection system examines repository files to identify:

- **Test frameworks** (Jest, pytest, RSpec, etc.)
- **Package managers** (npm, pip, Composer, etc.) 
- **CI/CD systems** (GitHub Actions, Jenkins, GitLab CI)
- **Build tools and configuration files**
- **Development dependencies and tooling**

The `detectRepositoryInfo` function scans for specific file patterns and parses configuration files to build a comprehensive profile of the project's technical stack. This information is then formatted into human-readable context that informs the AI prompt generation process.

## Key Components

### Detection Logic
- Analyzes file extensions, names, and directory structures
- Parses package.json, requirements.txt, and similar manifest files
- Identifies configuration files for common development tools

### Context Formatting
- `_formatRepositoryInfo` converts detection results into prompt-ready descriptions
- Provides structured context about project characteristics to guide generation templates
- Enables the AI to generate framework-specific instructions and examples

## Relationships

- **Consumed by**: Guide Generation Agent uses detection results to contextualize guide generation
- **Integrates with**: PromptManager incorporates repository context into AI prompts
- **Part of**: Multi-agent documentation system that combines wiki content with project-specific insights

## Usage Examples

```javascript
// Basic repository detection
const repoInfo = await detectRepositoryInfo('/path/to/project');
// Returns: { testFrameworks: ['jest'], packageManagers: ['npm'], ... }

// Integration with guide generation
const agent = new GuideGenerationAgent();
const guides = await agent.generateGuides(wikiData, {
  repositoryContext: repoInfo
});
```

The detection results automatically influence guide content - for example, setup instructions will reference npm if package.json is detected, or include pytest commands if Python test files are found.