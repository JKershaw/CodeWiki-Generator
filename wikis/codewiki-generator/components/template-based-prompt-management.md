---
title: Template-based prompt management
category: component
sourceFile: lib/prompts.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Template-based Prompt Management

## Purpose and Overview

PromptManager provides a centralized system for managing dynamic prompt templates with variable substitution. It enables agents and other components to generate context-specific prompts without code changes by loading template files and substituting `{{variable}}` placeholders with runtime values. This foundational pattern supports customizable AI agent behavior through external template files rather than hardcoded strings.

## Key Functionality

PromptManager offers the following core capabilities:

- **Template Loading with Caching**: Loads `.txt` template files from a configurable prompts directory and caches them in memory to improve performance across multiple renders
- **Variable Substitution**: Replaces `{{variable}}` placeholders in templates with provided values, with validation to ensure all required variables are supplied
- **Error Handling**: Provides descriptive error messages when templates are missing or variables are incomplete
- **Convenience Methods**: Combines loading and rendering into single method calls for simplified usage

The manager works by:
1. Accepting a template string or file identifier
2. Resolving variables against a provided object
3. Returning the fully rendered prompt string

## Relationships

PromptManager connects to the broader agent system in these ways:

- **Agent Integration**: Agent implementations use PromptManager to generate dynamic prompts based on context, user input, or system state
- **Template Storage**: Templates are stored as `.txt` files in a configurable prompts directory, keeping prompt content separate from code
- **Behavioral Customization**: Variable substitution enables agents to adapt their prompts without requiring code changes

## Usage Example

```javascript
const PromptManager = require('./lib/prompts');

const promptManager = new PromptManager();

// Simple template rendering with variable substitution
const template = 'Hello {{name}}, you are {{age}} years old.';
const variables = { name: 'Alice', age: 30 };

const result = promptManager.renderTemplate(template, variables);
// Result: "Hello Alice, you are 30 years old."

// Load and render a template file in one call
const agentPrompt = promptManager.render('agent-instructions', {
  role: 'assistant',
  context: 'user support'
});
```

## Testing

PromptManager includes comprehensive test coverage with 20 test cases across 7 test suites:

- **renderTemplate**: Variable substitution, multiple variable occurrences, and required variable validation
- **getTemplate**: File loading, caching behavior, and error handling for missing templates
- **render**: Combined loading and rendering operations
- **Template-specific tests**: Dedicated suites for code-analysis, documentation-writer, and meta-analysis templates

Tests are located in `tests/unit/prompts.test.js` and verify both core functionality and integration with template files.