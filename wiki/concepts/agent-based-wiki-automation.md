---
title: Agent-based wiki automation
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Agent-based Wiki Automation

## Purpose and Overview

The agent-based wiki automation system uses specialized agents to handle specific wiki generation tasks, providing a modular and extensible approach to documentation automation. This pattern enables focused, AI-powered content generation for different aspects of wiki maintenance.

## Key Functionality

### WikiIndexAgent

The `WikiIndexAgent` generates structured index pages that organize wiki content by category. It processes wiki metadata and creates navigational overviews using AI-generated content.

**Core Operations:**
- **Content Generation**: Uses Claude AI to create contextual descriptions and navigation structures
- **Category Organization**: Groups pages into concepts, components, and guides for logical browsing
- **Markdown Processing**: Cleans AI output to ensure consistent formatting and remove artifacts

**Workflow:**
1. Takes wiki metadata containing page information and categories
2. Formats data into structured categories using `_formatWikiStructure`
3. Generates content via Claude AI with template-based prompts
4. Post-processes output with `_cleanMarkdown` to remove code blocks and formatting artifacts

### Category-driven Content Organization

The system organizes documentation using a three-tier categorization:
- **Concepts**: High-level architectural patterns and design principles
- **Components**: Specific code elements and their implementations  
- **Guides**: Process documentation and how-to instructions

## Relationships

- **ClaudeClient**: Provides AI content generation capabilities
- **PromptManager**: Supplies template-based prompt generation for consistent AI interactions
- **Wiki Automation System**: Implements Phase 2 functionality as part of broader documentation pipeline
- **Agent Pattern**: Establishes reusable pattern for specialized wiki tasks

## Usage Examples

```javascript
const indexAgent = new WikiIndexAgent();
const wikiData = {
  pages: [...],
  categories: { concepts: [...], components: [...], guides: [...] }
};

const indexContent = await indexAgent.generateIndex(wikiData);
// Returns formatted markdown for index.md
```

The agent pattern enables easy extension for additional wiki tasks like cross-reference generation, content validation, or specialized formatting agents.