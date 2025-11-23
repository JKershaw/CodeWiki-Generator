---
title: GuideGenerationAgent
category: component
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Guide Generation Agent

## Purpose and Overview

The GuideGenerationAgent automates the creation of operational guides by analyzing repository structure and existing wiki documentation. It transforms technical concepts into actionable documentation that helps developers understand how to work with specific codebases based on their detected characteristics.

## Key Functionality

### Orchestrated Guide Generation

The `generateWikiGuides` function coordinates the complete guide generation workflow:

1. **Wiki Content Collection**: Gathers existing documentation pages from the wiki system
2. **Repository Scanning**: Uses `scanDir` to recursively analyze directory structure and collect file information
3. **AI-Powered Generation**: Delegates to the GuideGenerationAgent instance for intelligent guide creation

### Repository Introspection

The agent implements automatic repository detection through file system analysis:

```javascript
// scanDir recursively builds repository structure
const repoStructure = await scanDir(repositoryPath);
// Agent analyzes structure to detect frameworks, tools, patterns
```

This introspection enables context-aware guide generation that matches the actual project setup rather than generic recommendations.

### Content Processing Pipeline

- **Structure Analysis**: Processes wiki concepts and components to understand existing documentation patterns
- **Context Integration**: Combines repository characteristics with documented concepts
- **Guide Synthesis**: Generates practical operational guides through AI analysis
- **Category Organization**: Leverages existing category-based page organization for structured output

## Relationships

- **Integrates** with the multi-agent architecture alongside CodeAnalysisAgent and DocumentationWriterAgent
- **Consumes** wiki pages from WikiManager for content analysis
- **Follows** established agent patterns for specialized documentation tasks
- **Utilizes** the category-based organization system for consistent content structure

## Usage Examples

### Complete Guide Generation

```javascript
import { generateWikiGuides } from './guide-generation';

// Generates guides from repository and existing wiki content
const guides = await generateWikiGuides({
  repositoryPath: '/path/to/repo',
  wikiManager: wikiManagerInstance
});
```

### Repository Analysis

```javascript
// Scans directory structure for repository characteristics
const structure = await scanDir('./src');
// Returns file tree used for context-aware guide generation
```

The agent serves as a bridge between raw repository data and actionable documentation, ensuring generated guides are both comprehensive and practically relevant to the specific development environment.