---
title: Agent-based wiki automation
category: concept
sourceFile: lib/agents/wiki-index-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiIndexAgent

## Purpose and Overview

WikiIndexAgent generates organized index.md files that provide navigation and structure for wiki documentation. It analyzes the wiki's page metadata, leverages Claude AI to create contextually appropriate index content, and automatically categorizes pages into semantic sections. This agent enables scalable, maintainable wiki organization through AI-driven automation.

## Key Functionality

### Index Generation Workflow

The agent orchestrates a multi-step process to produce clean, well-organized index files:

1. **Structure Formatting** - Organizes wiki pages into categorical sections (Concepts, Components, Guides) based on metadata
2. **Prompt Rendering** - Uses PromptManager to render wiki-specific templates with structured page data
3. **Content Generation** - Calls Claude API to generate descriptive index content with automatic categorization
4. **Output Cleaning** - Sanitizes AI-generated markdown by removing code block wrappers, frontmatter, and normalizing whitespace

### Core Methods

- **`generateIndex(wikiData, options)`** - Main async method that orchestrates the full index generation pipeline. Takes wiki page metadata and returns clean markdown content ready for file system integration.

- **`_formatWikiStructure(pages)`** - Private method that organizes pages by category field, creating structured input for the Claude prompt that includes title, path, and category information.

- **`_cleanMarkdown(content)`** - Private method that normalizes AI-generated output by stripping markdown code blocks, removing YAML frontmatter, and standardizing whitespace.

### Category-Driven Organization

The agent structures wiki content into discrete semantic categories, enabling scalable organization. Pages are tagged with category metadata (concept, component, guide) which the agent uses to generate contextually appropriate index sections and navigation links.

## Relationships

- **Agent Architecture Pattern** - Extends the agent-based pattern established across `lib/agents/` for modular, AI-driven operations
- **ClaudeClient** - Depends on Claude API communication for content generation and AI-driven decision making
- **PromptManager** - Uses template rendering to inject wiki-specific context into prompts
- **Wiki File System** - Produces markdown output compatible with wiki storage and navigation requirements
- **Page Metadata** - Consumes structured wiki data containing title, path, and category for each page

## Usage Example

```javascript
const WikiIndexAgent = require('./lib/agents/wiki-index-agent');

const agent = new WikiIndexAgent();

const wikiData = {
  pages: [
    { title: 'Understanding Agents', path: 'concepts/agents.md', category: 'concept' },
    { title: 'Wiki Index Agent', path: 'components/wiki-index-agent.md', category: 'component' },
    { title: 'Getting Started', path: 'guides/getting-started.md', category: 'guide' }
  ]
};

const indexMarkdown = await agent.generateIndex(wikiData);
// Returns organized index with sections for Concepts, Components, and Guides
```

## Testing

No automated tests are currently available for this component. Test coverage should be added to verify:
- Correct categorization and organization of pages
- Proper sanitization of AI-generated markdown
- Handling of edge cases (missing fields, empty categories, special characters)