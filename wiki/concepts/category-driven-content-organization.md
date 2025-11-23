---
title: Category-driven content organization
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Category-driven Content Organization

## Purpose and Overview

Category-driven content organization provides a systematic approach to structuring wiki documentation by automatically categorizing pages into concepts, components, and guides. This organizational pattern enables scalable documentation management and generates structured navigation that adapts as the codebase grows.

## Key Functionality

The system categorizes documentation pages based on their content type and abstraction level:

- **Concepts** - High-level architectural patterns and design principles
- **Components** - Specific code elements like classes, functions, and modules  
- **Guides** - Step-by-step instructions and tutorials

### Content Structuring Process

1. **Categorization** - Pages are automatically classified during analysis based on their content and purpose
2. **Hierarchical Organization** - Content is organized by category with subcategorizations by abstraction level
3. **Navigation Generation** - Structured indexes are created showing the relationships between different documentation types
4. **Cross-referencing** - Related concepts, components, and guides are linked to provide contextual navigation

### Abstraction Levels

Content within each category is further organized by abstraction:
- **High** - Broad patterns and architectural concepts
- **Medium** - Implementation strategies and specific approaches
- **Low** - Detailed code-level documentation

## Relationships

**Implemented by:**
- `WikiIndexAgent` - Generates categorized index pages using this organizational structure
- `_formatWikiStructure` - Transforms raw page data into the category-based hierarchy

**Enables:**
- Automatic navigation generation based on content categories
- Scalable documentation architecture that grows with the codebase
- Clear separation between conceptual, technical, and instructional content

**Supports:**
- Agent-based wiki automation by providing consistent content organization
- Template-driven content generation through structured data formatting

## Usage Examples

### Category Structure Output
```markdown
## Concepts
- Agent-based wiki automation (high abstraction)
- Category-driven content organization (medium abstraction)

## Components  
- WikiIndexAgent
- PromptManager
- ClaudeClient

## Guides
- Adding new wiki agents
- Customizing wiki categorization
```

### Integration with Wiki Generation
The category system integrates with AI-powered content generation to create contextually appropriate documentation that maintains consistent organization across the entire wiki structure.