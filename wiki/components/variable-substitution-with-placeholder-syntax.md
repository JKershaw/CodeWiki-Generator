---
title: Variable substitution with placeholder syntax
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Variable Substitution with Placeholder Syntax

## Purpose and Overview

This component provides a template-based prompt generation system that enables dynamic content creation through variable substitution. It allows developers to create reusable prompt templates with `{{variable}}` placeholders that get replaced with actual values at runtime, supporting flexible and maintainable prompt management for AI agents.

## Key Functionality

The system centers around the **PromptManager** class, which handles both template loading and rendering operations:

- **Template Loading**: Retrieves template files from the `lib/prompts` directory as `.txt` files
- **Caching**: Stores loaded templates in memory to avoid repeated file system operations
- **Variable Substitution**: Replaces `{{variable}}` syntax with provided values using the `renderTemplate` function
- **Unified Interface**: Combines loading and rendering through the `render` method for streamlined usage

### Core Methods

- `getTemplate(templateName)` - Loads and caches template content from filesystem
- `renderTemplate(template, variables)` - Performs placeholder substitution on template strings
- `render(templateName, variables)` - Convenience method that loads template and applies variables in one call

## Relationships

This component serves as the foundation for agent prompt management systems and integrates with:

- **File System**: Depends on Node.js `fs` and `path` modules for template file operations
- **Template Storage**: Expects structured template organization in `lib/prompts/` directory
- **Agent Systems**: Provides the underlying template pattern for dynamic prompt generation across the application

## Usage Examples

```javascript
const promptManager = new PromptManager();

// Basic template rendering
const template = "Hello {{name}}, your role is {{role}}";
const rendered = promptManager.renderTemplate(template, {
  name: "Assistant", 
  role: "helpful AI"
});
// Result: "Hello Assistant, your role is helpful AI"

// File-based template usage
const result = await promptManager.render("greeting", {
  userName: "John",
  currentTime: "morning"
});
// Loads lib/prompts/greeting.txt and substitutes variables
```