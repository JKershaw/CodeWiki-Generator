---
title: Category-based content organization
category: concept
related: []
created: 2025-11-23
updated: 2025-11-23
---

# Category-based Content Organization

Category-based content organization provides a systematic approach to structuring documentation within the codebase wiki. This categorization enables automated guide generation, efficient navigation, and serves as the foundation for architectural analysis and synthesis.

## Key Functionality

The organization system categorizes all documentation into three primary types:

- **Concepts** - High-level architectural ideas, patterns, and system-wide approaches
- **Components** - Individual code elements, classes, modules, and their specific implementations  
- **Guides** - Step-by-step instructions and how-to documentation for users and developers

### Automated Index Generation

The `WikiIndexAgent` creates structured navigation pages by processing categorized content:

- Uses AI-powered content analysis to generate coherent index pages
- Transforms page data into categorized text format through `_formatWikiStructure`
- Sanitizes generated markdown content with `_cleanMarkdown` to ensure consistent formatting
- Creates hierarchical navigation that reflects the category-based organization

### Automated Guide Generation

The system leverages categorized content to automatically generate operational guides:

- Scans repository structure using `scanDir` to understand project layout
- Analyzes existing concepts and components documentation
- Generates setup, deployment, and usage guides through `GuideGenerationAgent`
- Integrates repository context with wiki content for comprehensive operational documentation

### Categorization Process

The system automatically analyzes documentation content to determine appropriate categories based on:

- Content abstraction level (high-level concepts vs. specific implementations)
- Purpose and scope (system-wide vs. component-specific)
- Target audience (architectural understanding vs. implementation details)

### Directory Structure

Categories map to specific directory structures within the wiki:

```
wiki/
├── concepts/           # High-level architectural concepts
├── components/         # Individual code elements  
├── guides/            # How-to and instructional content (auto-generated)
└── index.md           # Generated navigation structure
```

## Relationships

Category-based organization integrates deeply with the documentation generation pipeline:

- **WikiManager** uses categories to organize and retrieve content systematically
- **WikiIndexAgent** processes categorized pages to create navigational index files
- **[GuideGenerationAgent](../components/guide-generation-agent.md)** processes categorized content to create operational guides
- **[ArchitectureOverviewAgent](../components/architecture-overview-agent.md)** relies on categorization to identify and synthesize concept-level documentation
- **DocumentationWriterAgent** assigns categories during initial content creation
- **ClaudeClient** and **PromptManager** power the AI-driven index generation process

## Usage Examples

### Automatic Categorization

When new documentation is generated, the system automatically determines placement:

```markdown
# Example: High-level pattern → concepts/
"Implements event-driven architecture pattern across multiple services"

# Example: Specific class → components/  
"UserRepository class handles database operations for user entities"

# Example: Instructions → guides/ (auto-generated)
"How to configure authentication middleware in your application"
```

### Index Generation Workflow

The `generateIndex` function creates structured navigation by:

1. Receiving categorized wiki data with page metadata
2. Formatting page information into prompt-suitable text structure
3. Using AI to generate coherent, navigable index content
4. Cleaning and normalizing the output markdown for consistency