---
title: WikiIndexAgent class
category: component
sourceFile: lib/agents/wiki-index-agent.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# WikiIndexAgent Class

## Purpose and [Overview](../meta/overview.md)

WikiIndexAgent is a specialized agent that handles Phase 2 of the wiki generation system, responsible for creating index.md files with intelligent navigation structures. It leverages AI-driven content generation through Claude API to compose organized wiki indexes based on categorized documentation data.

## Key Functionality

**Index Generation**: Creates index.md files by processing wiki structure data and generating appropriate navigation content through Claude API integration.

**Content Composition**: Takes categorized wiki data (concepts, components, guides) and transforms it into coherent index pages with proper organization and linking.

**AI-Powered Formatting**: Uses Claude for intelligent content generation, then applies post-processing cleanup including:
- Removing markdown code block wrappers
- Stripping frontmatter 
- Normalizing newlines and whitespace
- Ensuring consistent output format

**Dependency Injection**: Implements clean architecture patterns by accepting ClaudeClient and PromptManager as constructor dependencies.

## Relationships

**Agent Architecture**: Part of a multi-phase, agent-based wiki generation system where each agent handles distinct responsibilities. WikiIndexAgent specifically handles Phase 2 processing.

**Claude Integration**: Depends on ClaudeClient for AI content generation and PromptManager for structured prompt handling.

**Wiki Structure**: Consumes categorized documentation data and produces index files that serve as entry points for the generated wiki navigation.

## Usage Example

```javascript
const WikiIndexAgent = require('./lib/agents/wiki-index-agent');
const ClaudeClient = require('./claude-client');
const PromptManager = require('./prompt-manager');

const claudeClient = new ClaudeClient();
const promptManager = new PromptManager();
const agent = new WikiIndexAgent(claudeClient, promptManager);

// Process wiki structure data to generate index
const result = await agent.generateIndex(wikiStructureData);
```

## Testing

No automated tests found for this component.