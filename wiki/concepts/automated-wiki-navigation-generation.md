---
title: Automated wiki navigation generation
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Automated Wiki Navigation Generation

The automated wiki navigation generation system dynamically creates structured index pages for documentation wikis using AI-powered content organization. This eliminates manual maintenance of navigation structures and ensures consistent, categorized access to all wiki content.

## Key Functionality

### WikiIndexAgent

The `WikiIndexAgent` serves as the primary orchestrator for generating wiki index files. It processes existing wiki page data and produces organized `index.md` files with categorized navigation links.

**Core workflow:**
1. **Structure Processing** - `_formatWikiStructure()` groups wiki pages by category (concepts, components, guides)
2. **AI Generation** - Uses Claude AI through the PromptManager with the 'wiki-index' template to generate navigation content
3. **Content Cleanup** - `_cleanMarkdown()` removes code blocks and frontmatter from AI output
4. **Index Creation** - `generateIndex()` returns formatted markdown ready for wiki deployment

### Category-Based Organization

The system organizes content using a three-tier categorization:
- **Concepts** - High-level architectural patterns and abstractions
- **Components** - Specific code elements, classes, and functions  
- **Guides** - How-to documentation and tutorials

Pages are automatically sorted within categories, creating predictable navigation structures that scale with content growth.

## Relationships

- **Extends** the agent-based architecture pattern used throughout the system
- **Depends on** ClaudeClient for AI-powered content generation
- **Utilizes** PromptManager for consistent template-driven prompt construction
- **Implements** the 'wiki-index' prompt template interface for standardized output

## Usage Example

```javascript
const wikiAgent = new WikiIndexAgent(claudeClient, promptManager);

const wikiData = {
  pages: [
    { title: "Authentication System", category: "concept" },
    { title: "UserService", category: "component" },
    { title: "Setting up OAuth", category: "guide" }
  ]
};

const indexContent = await wikiAgent.generateIndex(wikiData);
// Returns formatted markdown with categorized navigation links
```

The generated index automatically groups related content and maintains consistent formatting across different wiki sections, enabling users to navigate large documentation sets efficiently.