---
title: Wiki index generation system
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Wiki Index Generation System

The wiki index generation system automatically creates structured navigation pages for documentation wikis. It analyzes existing wiki content and generates organized index.md files with categorized links, enabling users to easily discover and navigate documentation.

## Key Functionality

### Automated Index Creation

The `WikiIndexAgent` serves as the core component that orchestrates index generation:

- **Content Analysis**: Processes wiki page data to identify categories (concepts, components, guides)
- **AI-Powered Generation**: Leverages Claude AI to create human-readable navigation content
- **Markdown Output**: Produces clean, formatted index.md files ready for wiki deployment

### Category-Based Organization

The system implements hierarchical content grouping:

- **Flexible Categorization**: Automatically sorts pages into concepts, components, and guides
- **Structured Navigation**: Creates logical page hierarchies based on content type and relationships
- **Dynamic Updates**: Regenerates indexes as wiki content changes

### Content Processing Pipeline

1. **Data Formatting**: `_formatWikiStructure` transforms raw page data into categorized text
2. **Prompt Generation**: Integrates with PromptManager for template-based AI instructions  
3. **Content Generation**: Claude AI creates structured navigation content
4. **Markdown Cleaning**: `_cleanMarkdown` sanitizes output by removing code blocks and normalizing formatting

## Relationships

- **ClaudeClient Integration**: Uses AI capabilities for intelligent content organization and description generation
- **PromptManager Dependency**: Leverages template system for consistent AI instruction formatting
- **Agent Architecture**: Follows established agent pattern alongside other wiki generation components
- **Workflow Integration**: Complements existing documentation generation processes

## Usage Examples

### Basic Index Generation

```javascript
const wikiAgent = new WikiIndexAgent();
const indexContent = await wikiAgent.generateIndex(wikiData);
```

### Custom Category Structure

The system automatically categorizes content but can be extended to support custom groupings by modifying the `_formatWikiStructure` method to recognize additional page types or metadata.