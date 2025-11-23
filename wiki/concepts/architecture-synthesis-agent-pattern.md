---
title: Architecture synthesis agent pattern
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Architecture Synthesis Agent Pattern

## Purpose and Overview

The architecture synthesis agent pattern enables automatic generation of high-level system documentation by combining and analyzing existing wiki content. This meta-documentation approach allows agents to create comprehensive overviews from distributed documentation sources, establishing a hierarchical documentation generation system.

## Key Functionality

### ArchitectureOverviewAgent

The `ArchitectureOverviewAgent` serves as the primary implementation of this pattern, generating system-wide architecture documentation by:

- **Content Aggregation**: Collects and formats concepts, components, and guides from existing wiki data
- **AI-Powered Synthesis**: Uses Claude to analyze relationships and create coherent architectural narratives
- **Structured Output**: Generates clean markdown documentation suitable for architecture.md files

### Core Workflow

1. **Data Preparation**: Formats wiki content using specialized methods (`_formatConcepts`, `_formatComponents`, `_formatGuides`)
2. **Template Processing**: Leverages PromptManager with 'architecture-overview' template for consistent generation
3. **Content Generation**: Orchestrates synthesis through `generateArchitectureOverview` method
4. **Post-Processing**: Cleans generated content with `_cleanMarkdown` to remove artifacts

## Relationships

- **Depends on**: ClaudeClient for AI content generation capabilities
- **Integrates with**: PromptManager for template-based prompt construction  
- **Consumes**: Structured wiki data containing categorized documentation elements
- **Extends**: Established agent pattern used throughout the documentation system

## Usage Examples

```javascript
const agent = new ArchitectureOverviewAgent(claudeClient, promptManager);

// Generate architecture overview from wiki data
const overview = await agent.generateArchitectureOverview({
  concepts: [...], // High-level architectural concepts
  components: [...], // System components and implementations  
  guides: [...] // Usage and development guides
});
```

The pattern supports creating specialized synthesis agents for different documentation domains by following the same aggregation → formatting → generation → cleaning workflow established by `ArchitectureOverviewAgent`.