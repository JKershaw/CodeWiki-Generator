---
title: Operational Guide Generation
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Operational Guide Generation

The Operational Guide Generation system automatically creates practical documentation like setup guides, deployment instructions, and usage tutorials by analyzing existing wiki content and repository structure. This provides teams with ready-to-use operational documentation without manual writing effort.

## Key Functionality

### Guide Generation Process

The system follows a structured workflow to produce comprehensive guides:

1. **Content Categorization** - Analyzes existing wiki content to identify components, concepts, and implementation patterns
2. **Repository Analysis** - Scans the codebase structure using `scanDir()` to understand project organization and identify key files
3. **Guide Synthesis** - Combines categorized content with repository insights to generate contextual operational guides

### Core Components

- **GuideGenerationAgent** - The primary orchestrator that processes wiki content and repository data to generate guides
- **generateWikiGuides** - Main function that coordinates the entire generation process, from content analysis to file output
- **Category-based Organization** - Systematically groups content into logical categories (components, concepts, guides) for structured processing

### Repository Structure Analysis

The system automatically inventories the repository to inform guide generation:
- Recursively scans directories to map project structure
- Identifies configuration files, source code patterns, and documentation
- Uses this context to create project-specific operational instructions

## Relationships

### Integration Points

- **Extends Wiki Workflow** - Integrates into the existing wiki management pipeline before index creation
- **Agent Architecture** - Works alongside CodeAnalysisAgent, DocumentationWriterAgent, and MetaAnalysisAgent
- **WikiManager Dependency** - Uses WikiManager for content retrieval and file operations
- **Complements Analysis** - Provides operational perspective to MetaAnalysisAgent's technical insights

### Processing Pipeline

The guide generation fits into the broader documentation workflow by taking analyzed code concepts and transforming them into actionable operational documentation, bridging the gap between technical analysis and practical usage.

## Usage Context

Guide generation typically runs as part of automated documentation updates, producing guides like:
- Setup and installation procedures
- Deployment workflows  
- Component integration instructions
- Usage tutorials for key features

The generated guides reflect both the current state of the codebase and the accumulated knowledge in the wiki, ensuring operational documentation stays synchronized with code evolution.