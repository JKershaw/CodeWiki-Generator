---
title: Category-driven documentation structure
category: component
sourceFile: lib/agents/wiki-index-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# WikiIndexAgent

## Purpose and Overview

WikiIndexAgent generates automated index.md files that provide navigation and organizational structure for wiki content. It analyzes the wiki's page structure, categorizes pages semantically (Concepts, Components, Guides), and uses Claude to create contextually appropriate index content that scales with wiki growth.

## Key Functionality

WikiIndexAgent orchestrates index generation through the following process:

- **Structure Organization**: Formats wiki pages into categorical sections via `_formatWikiStructure()`, grouping pages by their semantic category (concept, component, guide)
- **Prompt Rendering**: Uses PromptManager to render wiki-specific prompts with the organized structure, providing Claude with context about the wiki's content
- **Content Generation**: Calls Claude API through ClaudeClient to generate index content with appropriate navigation, cross-references, and category summaries
- **Output Sanitization**: Cleans AI-generated markdown via `_cleanMarkdown()` by removing code block wrappers, frontmatter, and normalizing whitespace to ensure reliable wiki integration

### Main Methods

- **`generateIndex(wikiData, options)`**: Main async method that orchestrates the complete index generation pipeline. Takes wiki page metadata and returns cleaned markdown suitable for direct file system integration.
- **`_formatWikiStructure(wikiData)`**: Organizes pages into categorical sections for structured input to Claude prompts.
- **`_cleanMarkdown(content)`**: Removes formatting artifacts from Claude output to produce consistent, wiki-compatible markdown.

## Relationships

WikiIndexAgent follows the agent architecture pattern established across `lib/agents/`:

- **ClaudeClient**: Provides API communication and prompt-based content generation capabilities
- **PromptManager**: Renders wiki-specific prompt templates with categorized page data as context
- **Wiki Page Metadata**: Consumes pages with title, path, and category fields to structure navigation
- **Agent Architecture**: Extends the modular AI-driven operations pattern used by other specialized agents

The agent's output integrates directly with the wiki file system, enabling automated index generation without manual maintenance.

## Usage Example

```javascript
const WikiIndexAgent = require('./lib/agents/wiki-index-agent');
const agent = new WikiIndexAgent();

const wikiData = {
  pages: [
    { title: 'Agent Pattern', path: '/docs/agent-pattern', category: 'concept' },
    { title: 'Database Component', path: '/docs/database', category: 'component' },
    { title: 'Getting Started', path: '/docs/getting-started', category: 'guide' }
  ]
};

const indexMarkdown = await agent.generateIndex(wikiData);
// Returns organized, cleaned markdown ready for index.md file
```

## Testing

No automated test coverage is currently available for this component. Testing recommendations should include:

- Validation of category filtering and structural formatting
- Verification that markdown sanitization handles various Claude output formats
- Integration testing with actual wiki file system operations