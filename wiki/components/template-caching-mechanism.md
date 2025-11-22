---
title: Template caching mechanism
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Template Caching Mechanism

## Purpose and Overview

The template caching mechanism provides efficient loading and rendering of prompt templates with variable substitution capabilities. It reduces filesystem overhead by caching template content in memory and supports dynamic prompt generation through placeholder replacement.

## Key Functionality

### Template Loading and Caching
- **`getTemplate(templateName)`** - Loads template files from `lib/prompts/` directory as `.txt` files
- Implements in-memory caching to avoid repeated file system reads for the same template
- Uses Node.js `fs` and `path` modules for filesystem operations

### Variable Substitution
- **`renderTemplate(template, variables)`** - Processes template strings containing `{{variable}}` placeholder syntax
- Replaces placeholders with corresponding values from the provided variables object
- Supports dynamic content generation based on runtime data

### Unified Interface
- **`render(templateName, variables)`** - Combines template loading and rendering in a single operation
- Provides convenient method for common use case of loading and immediately rendering a template

## Relationships

- **File Structure**: Expects template files to exist as `.txt` files in the `lib/prompts/` directory
- **Agent System**: Serves as the foundation for agent prompt management, enabling modular and reusable prompt definitions
- **Template Pattern**: Implements the template design pattern for separating prompt structure from dynamic content

## Usage Examples

```javascript
const promptManager = new PromptManager();

// Direct rendering with template loading
const prompt = promptManager.render('user-greeting', {
  name: 'John',
  role: 'administrator'
});

// Separate loading and rendering
const template = promptManager.getTemplate('system-instructions');
const rendered = promptManager.renderTemplate(template, {
  context: 'customer support',
  guidelines: 'be helpful and concise'
});
```

Template file example (`lib/prompts/user-greeting.txt`):
```
Hello {{name}}! You are logged in as a {{role}}.
```