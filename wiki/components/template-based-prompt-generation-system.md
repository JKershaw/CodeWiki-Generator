---
title: Template-based prompt generation system
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Template-based Prompt Generation System

## Purpose and Overview

The template-based prompt generation system provides a structured approach for creating dynamic prompts using file-based templates with variable substitution. This system enables separation of prompt content from application logic, making prompts easier to maintain and modify without code changes.

## Key Functionality

The system operates through the `PromptManager` class, which handles template loading, caching, and rendering:

- **Template Loading**: Reads template files from the `lib/prompts` directory as `.txt` files
- **Variable Substitution**: Replaces `{{variable}}` placeholders with actual values using string interpolation
- **Caching**: Stores loaded templates in memory to avoid repeated file system operations
- **Dynamic Rendering**: Combines template loading and variable substitution in a single operation

### Core Methods

- `getTemplate(name)` - Loads and caches template content from filesystem
- `renderTemplate(template, variables)` - Performs variable substitution on template strings
- `render(templateName, variables)` - Convenience method that loads and renders templates in one call

## Relationships

- **File System Dependencies**: Uses Node.js `fs` and `path` modules for template file operations
- **Agent Integration**: Serves as the foundation for agent prompt management systems
- **Template Pattern**: Implements the template design pattern for dynamic content generation
- **Storage Convention**: Expects template files to follow the naming pattern `{templateName}.txt` in the designated prompts directory

## Usage Examples

```javascript
const promptManager = new PromptManager();

// Load and render a template with variables
const result = promptManager.render('greeting', {
  name: 'Alice',
  role: 'developer'
});

// Template file (greeting.txt):
// Hello {{name}}, welcome to the {{role}} portal!
// Result: "Hello Alice, welcome to the developer portal!"
```

```javascript
// Manual template loading and rendering
const template = promptManager.getTemplate('analysis');
const rendered = promptManager.renderTemplate(template, {
  dataType: 'user metrics',
  timeframe: 'last 30 days'
});
```

This system enables maintainable prompt management by keeping template content in easily editable text files while providing programmatic variable injection capabilities.