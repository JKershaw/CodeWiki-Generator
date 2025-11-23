---
title: Guide generation system
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Guide Generation System

## Purpose and Overview

The guide generation system automatically creates operational documentation by analyzing repository structure and existing wiki content. It provides users with practical guides for common development tasks without requiring manual documentation maintenance.

## Key Functionality

The system operates through three main phases:

### Repository Analysis
- **File system scanning** - The `scanDir` function recursively traverses the project directory to collect file types, structure patterns, and project characteristics
- **Technology detection** - Identifies frameworks, build tools, and development patterns from file extensions and naming conventions
- **Complexity assessment** - Analyzes repository size and organization to tailor guide recommendations

### Content Integration
- **Wiki page collection** - Gathers existing documentation from the WikiManager to understand current knowledge gaps
- **Category analysis** - Reviews page categories to identify documentation patterns and missing operational guides
- **Context building** - Combines repository data with existing documentation to create comprehensive context for guide generation

### Guide Generation
- **Automated writing** - The `GuideGenerationAgent` synthesizes repository analysis and existing content into practical operational guides
- **Task-focused content** - Generates guides that address specific developer workflows like setup, deployment, and maintenance
- **Contextual relevance** - Tailors guide content to match the actual project structure and technology stack

## Relationships

The guide generation system integrates with the existing agent architecture:

- **WikiManager integration** - Consumes existing wiki pages to understand current documentation state and avoid duplication
- **Agent coordination** - Works alongside `CodeAnalysisAgent` and `DocumentationWriterAgent` as part of the specialized documentation pipeline
- **Category system** - Leverages the established page categorization system to organize generated guides appropriately
- **Workflow orchestration** - Follows the standard agent pattern through the main `generateWikiGuides` function

## Usage

The system runs as part of the documentation generation workflow:

```javascript
// Triggered during wiki generation process
generateWikiGuides(projectPath, wikiManager)
```

The function automatically:
1. Scans the repository structure at `projectPath`
2. Retrieves existing wiki content from `wikiManager`
3. Generates contextually appropriate operational guides
4. Integrates new guides into the wiki system

Generated guides focus on practical developer needs such as project setup, common workflows, troubleshooting, and maintenance tasks specific to the detected project characteristics.