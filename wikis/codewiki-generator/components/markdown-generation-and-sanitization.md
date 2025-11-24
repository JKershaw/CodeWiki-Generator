---
title: Markdown generation and sanitization
category: component
sourceFile: lib/agents/wiki-index-agent.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Markdown Generation and Sanitization

## Purpose and Overview

The `WikiIndexAgent` class automates the generation of `index.md` files for wiki navigation by analyzing wiki structure and using Claude to create organized, categorized index content. This component ensures that AI-generated markdown output is properly cleaned and formatted for reliable integration into the wiki file system, removing extraneous formatting markers and normalizing content structure.

## Key Functionality

### Index Generation Workflow

The agent orchestrates a multi-step process to produce wiki index files:

1. **Structure Analysis** – Organizes wiki pages into categorical sections (Concepts, Components, Guides) using the `_formatWikiStructure` method
2. **Prompt Rendering** – Uses PromptManager to render contextual prompts with the structured wiki data
3. **Content Generation** – Calls the Claude API through ClaudeClient to generate index markdown
4. **Output Sanitization** – Applies the `_cleanMarkdown` method to remove code block markers, frontmatter, and normalize whitespace

### Core Methods

- **`generateIndex(wikiData)`** – Main async method that orchestrates the complete index generation pipeline
- **`_formatWikiStructure(pages)`** – Organizes wiki pages by category field into structured sections for prompt input
- **`_cleanMarkdown(content)`** – Sanitizes AI-generated markdown by stripping code block delimiters, removing frontmatter, and normalizing whitespace

### Category-Driven Structure

The agent leverages systematic organization of content by semantic categories, enabling contextually appropriate index navigation. Pages are automatically filtered and grouped by their `category` field, allowing scalable wiki organization without manual index maintenance.

## Relationships

- **Extends** – Agent architecture pattern established by other agents in `lib/agents/`
- **Depends on** – ClaudeClient for API communication and prompt-based content generation
- **Uses** – PromptManager for template rendering with wiki-specific context
- **Processes** – Wiki page metadata (title, path, category) to structure navigation
- **Produces** – Markdown output suitable for wiki file system integration

## Usage Example

```javascript
const WikiIndexAgent = require('./lib/agents/wiki-index-agent');

const agent = new WikiIndexAgent(claudeClient, promptManager);

const wikiData = {
  pages: [
    { title: 'Auth System', path: 'auth/overview.md', category: 'Concepts' },
    { title: 'API Client', path: 'clients/api.md', category: 'Components' },
    { title: 'Getting Started', path: 'guides/setup.md', category: 'Guides' }
  ]
};

const indexMarkdown = await agent.generateIndex(wikiData);
```

## Testing

No automated tests are currently available for this component. When implementing tests, focus on:
- Verification that wiki pages are correctly categorized by type
- Confirmation that markdown sanitization removes code block markers and frontmatter
- Validation that the generated index structure matches expected navigation patterns