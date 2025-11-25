---
title: File-based template storage with caching
category: component
sourceFile: lib/prompts.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# File-based template storage with caching

## Purpose and Overview

The file-based template storage system provides efficient loading and caching of prompt templates from the filesystem. Templates are stored as `.txt` files in a configurable directory and cached in memory to avoid repeated file I/O operations, improving performance while maintaining separation between prompt content and application code.

## Key Functionality

- **Template Loading**: Loads prompt templates from `.txt` files located in a configurable directory structure
- **In-Memory Caching**: Caches loaded templates to prevent redundant file system access and improve performance
- **File-based Organization**: Enables external management of prompt content without requiring code changes
- **Integration with Template Rendering**: Works seamlessly with the template variable interpolation system for complete prompt management

## Relationships

This component is part of the broader **Template-based prompt management system** implemented in the `PromptManager` class. It works in conjunction with:

- **Template variable interpolation and validation** - provides the raw template content that gets processed with variable substitution
- Template rendering methods that consume the cached templates
- Agent interaction systems that rely on dynamically generated prompts

## Usage Example

```javascript
const PromptManager = require('./lib/prompts');

// Initialize with default template directory
const promptManager = new PromptManager();

// Load and cache a template from file, then render with variables
const result = await promptManager.render('code-analysis', {
  filename: 'app.js',
  language: 'JavaScript'
});

// Subsequent calls use cached version for better performance
const anotherResult = await promptManager.render('documentation-writer', {
  component: 'UserService',
  description: 'Handles user authentication'
});
```

## Testing

**Test Coverage**: tests/unit/prompts.test.js
- 20 test cases across 7 test suites
- Covers template loading, caching behavior, and integration with rendering
- Includes tests for specific templates: code-analysis, documentation-writer, and meta-analysis
- Validates error handling for missing templates and file I/O failures