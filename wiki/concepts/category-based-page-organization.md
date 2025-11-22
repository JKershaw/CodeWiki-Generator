---
title: Category-based Page Organization
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Category-based Page Organization

## Purpose and Overview

Category-based page organization provides a systematic approach to structuring wiki documentation by grouping pages into logical categories such as concepts, components, and guides. This organizational system enables automatic generation of navigation structures and ensures consistent, discoverable documentation layout.

## Key Functionality

The organization system operates through three main categories:

- **Concepts**: High-level ideas, patterns, and architectural principles
- **Components**: Specific code elements, classes, and modules
- **Guides**: Step-by-step instructions and tutorials

### Automatic Index Generation

The `WikiIndexAgent` processes categorized pages to generate navigation indexes:

```python
# Example wiki data structure
wiki_data = {
    "concepts": [
        {"name": "Authentication Flow", "abstraction": "high"},
        {"name": "Data Pipeline", "abstraction": "medium"}
    ],
    "components": [
        {"name": "UserManager", "type": "class"},
        {"name": "DatabaseConnector", "type": "module"}
    ],
    "guides": [
        {"title": "Setting Up Development Environment"},
        {"title": "Deployment Guide"}
    ]
}
```

### Content Processing

The system formats and processes content through specialized methods:

- `_formatWikiStructure()` organizes pages by category for template input
- `_cleanMarkdown()` normalizes generated content by removing code blocks and frontmatter
- Template-driven generation ensures consistent formatting across all index pages

## Relationships

**Dependencies:**
- `ClaudeClient` for AI-powered content generation
- `PromptManager` for template-based prompt rendering

**Integrations:**
- Part of the agent-based architecture pattern
- Processes wiki data structures from content analysis systems
- Generates markdown files compatible with standard wiki platforms

**Data Flow:**
1. Content analysis categorizes pages
2. `WikiIndexAgent` processes categorized data
3. Templates format the structure for AI generation
4. Generated indexes provide navigation entry points

## Usage Examples

### Basic Index Generation

```python
agent = WikiIndexAgent()
index_content = agent.generateIndex(wiki_data)
# Produces structured markdown with categorized navigation links
```

### Category Structure

Pages are automatically organized into sections:

```markdown
## Concepts
- [Authentication Flow](concepts/authentication-flow.md)
- [Data Pipeline](concepts/data-pipeline.md)

## Components
- [UserManager](components/user-manager.md)
- [DatabaseConnector](components/database-connector.md)

## Guides
- [Setting Up Development Environment](guides/setup.md)
```

This categorization ensures users can quickly locate information based on their needs - whether they're seeking conceptual understanding, specific component details, or step-by-step guidance.