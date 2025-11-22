---
title: Wiki index generation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Wiki Index Generation

## Purpose and Overview

Wiki index generation creates structured navigation pages for generated documentation, enabling easy discovery and browsing of analyzed code components. This automated process runs as a completion phase after the main documentation generation, organizing all generated pages into a coherent index structure.

## Key Functionality

The wiki index generation system operates through a specialized agent-based approach:

- **WikiIndexAgent** - Generates structured index pages by analyzing existing documentation and creating hierarchical navigation
- **Conditional execution** - Only runs when processing completes successfully and remains within cost limits
- **Graceful degradation** - Index generation failures don't disrupt the main documentation process
- **Repository context** - Incorporates repository information to provide meaningful organization and context

The process collects all generated wiki pages through the WikiManager and delegates the actual index creation to the WikiIndexAgent, which structures the content for optimal navigation.

## Relationships

Wiki index generation integrates seamlessly with the existing agent architecture:

- Works alongside `CodeAnalysisAgent`, `DocumentationWriterAgent`, and `MetaAnalysisAgent`
- Depends on `WikiManager` for page collection and file system operations  
- Consumes output from the main processing workflow to understand repository structure
- Operates as the final phase in the documentation generation pipeline

## Usage

The index generation runs automatically as part of the documentation workflow:

```javascript
// Index generation is triggered after successful processing
if (processingComplete && !costLimitExceeded) {
  await generateWikiIndex(repoInfo, wikiManager);
}
```

The `generateWikiIndex` function orchestrates the entire process by:

1. Collecting existing wiki pages from the WikiManager
2. Passing repository context and page data to the WikiIndexAgent
3. Generating structured index content based on the analyzed documentation

This creates a comprehensive navigation structure that helps users explore the generated documentation efficiently, with pages organized by category, component type, and conceptual relationships.