---
title: Category-based documentation structure
category: concept
sourceFile: lib/agents/wiki-index-agent.js
related: [meta/overview.md, concepts/agent-based-wiki-generation-architecture.md]
created: 2025-11-25
updated: 2025-11-25
---

# Category-based documentation structure

## Purpose and [Overview](../meta/overview.md)

The category-based documentation structure organizes wiki pages into semantic categories (concepts, components, guides) to enable intelligent index generation and structured knowledge organization. This system allows the WikiIndexAgent to generate meaningful navigation structures and index pages based on the categorization of documentation content.

## Key Functionality

- **Semantic Organization**: Groups wiki content into logical categories that reflect different types of documentation (architectural concepts, code components, user guides)
- **Index Generation Support**: Provides structured data that enables automated generation of index.md files with appropriate navigation and content organization
- **Hierarchical Structure**: Creates a foundation for multi-level documentation organization where content can be logically grouped and cross-referenced
- **Scalable Categorization**: Supports extensible category systems that can grow with the codebase and documentation needs

## Relationships

- **WikiIndexAgent**: Primary consumer that uses the category structure to generate index pages and navigation elements
- **[Agent-based wiki generation architecture](../concepts/agent-based-wiki-generation-architecture.md)**: Fits into the broader multi-phase documentation generation system as the organizational foundation
- **AI-driven content generation**: Provides structured input data that helps Claude generate more coherent and well-organized index content
- **ClaudeClient**: Categories inform the prompts sent to Claude for generating contextually appropriate index content
- **PromptManager**: Category information is incorporated into prompts to guide AI content generation

## Usage Example

```javascript
const WikiIndexAgent = require('./lib/agents/wiki-index-agent');

// WikiIndexAgent uses category-based structure internally
const wikiAgent = new WikiIndexAgent(claudeClient, promptManager);

// The agent processes wiki structure with categories
const indexContent = await wikiAgent.generateIndex(wikiStructureData);
```

## Testing

No automated tests found for this component.