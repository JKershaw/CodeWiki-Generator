---
title: Automated guide generation from existing documentation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Automated Guide Generation from Existing Documentation

## Purpose and Overview

The automated guide generation system transforms existing documentation content into practical operational guides that help users understand how to work with the codebase. This capability bridges the gap between reference documentation and actionable guidance by leveraging both wiki content and repository structure analysis.

## Key Functionality

### Content Analysis and Categorization
The system categorizes existing documentation into components and concepts, enabling targeted guide generation strategies. Components receive implementation-focused guides, while concepts get architectural and usage guidance.

### Repository-Aware Generation
The `detectRepositoryInfo` function analyzes the actual codebase structure to inform guide generation:
- Scans file extensions and directory patterns
- Identifies technology stacks and frameworks
- Provides context for tailoring operational guidance

### Guide Generation Process
1. **Content Retrieval** - Loads existing wiki pages and categorizes them
2. **Repository Analysis** - Scans codebase structure using `scanDir` and `detectRepositoryInfo`
3. **Guide Synthesis** - The `GuideGenerationAgent` combines documentation content with repository insights
4. **Output Generation** - Creates practical guides focused on common operational tasks

## Relationships

### Integration Points
- **WikiManager Integration** - Leverages existing content management for retrieving and storing generated guides
- **Agent Architecture** - Extends the established agent-based pattern used throughout the documentation system
- **Workflow Position** - Operates after initial documentation generation but before index creation, enriching the documentation set

### Content Dependencies
- Builds upon categorized documentation from other agents
- Utilizes repository structure data to contextualize guidance
- Coordinates with the existing page classification system

## Usage Examples

### Basic Guide Generation
```javascript
const agent = new GuideGenerationAgent(wikiManager);
await generateWikiGuides(wikiManager, agent);
```

### Custom Repository Analysis
The system automatically detects project characteristics, but repository scanning can be configured through the file system analysis:
- Focuses on relevant file types and patterns
- Identifies framework-specific structures
- Adapts guide content based on detected technologies

The generated guides complement existing documentation by providing step-by-step operational procedures, common workflow patterns, and context-aware instructions tailored to the specific codebase characteristics.