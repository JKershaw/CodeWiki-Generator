---
title: Category-based page organization
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Category-based Page Organization

**Purpose and Overview**  
Category-based page organization is a standardized system for classifying wiki content into distinct types (concepts, components, guides) to enable systematic navigation generation. This organizational structure allows the WikiIndexAgent to automatically generate coherent index pages by grouping related content together.

## Key Functionality

The system establishes three primary categories for wiki content:

- **Concepts** - High-level architectural patterns and design principles
- **Components** - Specific code elements, classes, and modules  
- **Guides** - Step-by-step instructions and how-to documentation

### How It Works

1. **Page Classification** - Each wiki page is assigned to one of the standard categories based on its content type and purpose
2. **Structure Formatting** - The `_formatWikiStructure` function groups pages by category, creating a hierarchical data structure
3. **Navigation Generation** - Categorized content is processed through AI prompts to generate organized index pages with logical groupings

The categorization system ensures that:
- Related content appears together in navigation
- Users can quickly locate information by content type
- Index generation follows consistent organizational patterns

## Relationships

This organizational system integrates with several components:

- **WikiIndexAgent** - Consumes the category structure to generate navigation indexes
- **PromptManager** - Uses categorized data in the 'wiki-index' template for AI content generation
- **ClaudeClient** - Processes the organized structure to create coherent navigation content

The category system extends the broader agent-based architecture by providing standardized data structures that AI agents can reliably process.

## Usage Examples

### Basic Category Structure
```javascript
const wikiData = {
  concepts: [
    { name: "Automated navigation", path: "/concepts/auto-nav.md" }
  ],
  components: [
    { name: "WikiIndexAgent", path: "/components/wiki-agent.md" }
  ],
  guides: [
    { name: "Setting up wiki automation", path: "/guides/setup.md" }
  ]
};
```

### Generated Navigation Output
```markdown
## Concepts
- [Automated navigation](/concepts/auto-nav.md)

## Components  
- [WikiIndexAgent](/components/wiki-agent.md)

## Guides
- [Setting up wiki automation](/guides/setup.md)
```

This organizational approach ensures that documentation remains navigable and logically structured as the codebase grows.