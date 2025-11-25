---
title: Template-based prompt management system
category: component
sourceFile: lib/prompts.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Template-based prompt management system

## Purpose and Overview

The PromptManager provides a reusable system for loading, caching, and rendering prompt templates with variable substitution. This component enables decoupling of prompt content from code logic and supports dynamic prompt generation for agent interactions by storing templates as files and rendering them with runtime variables.

## Key Functionality

- **Template rendering**: Substitutes variables in templates using `{{variable}}` placeholder syntax with comprehensive validation
- **File-based storage**: Loads prompt templates from `.txt` files in a configurable directory structure
- **Caching mechanism**: Implements in-memory caching to avoid repeated file I/O operations and improve performance
- **Variable validation**: Detects missing or incorrect template variables before substitution to prevent runtime failures
- **Multiple template support**: Manages specialized templates for different purposes (code-analysis, documentation-writer, meta-analysis)

The system uses placeholder detection to identify `{{variable}}` patterns and validates that all required variables are provided before rendering, ensuring type safety and clear error handling.

## Relationships

This component serves as a foundational utility for other parts of the system that need dynamic prompt generation. It connects to:
- File system for template storage and retrieval
- Agent interaction components that require templated prompts
- Configuration system for template directory management
- Error handling system for validation failures

## Usage Example

```javascript
const PromptManager = require('./lib/prompts');

// Initialize the prompt manager
const promptManager = new PromptManager();

// Render a template with variables
const template = 'Hello {{name}}, you are {{age}} years old.';
const variables = { name: 'Alice', age: 30 };

const result = promptManager.renderTemplate(template, variables);
// Result: 'Hello Alice, you are 30 years old.'

// Load and render a template from file
const renderedPrompt = await promptManager.render('template-name', variables);
```

## Testing

**Test Coverage**: `tests/unit/prompts.test.js`
- 20 test cases across 7 test suites
- Comprehensive coverage including template rendering, file loading, caching behavior
- Specialized tests for code-analysis, documentation-writer, and meta-analysis templates
- Variable substitution and validation scenarios