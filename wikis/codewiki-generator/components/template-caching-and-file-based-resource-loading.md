---
title: Template caching and file-based resource loading
category: component
sourceFile: lib/prompts.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Template Caching and File-Based Resource Loading

## Purpose and Overview

The `PromptManager` class manages the loading, caching, and rendering of prompt templates used throughout the agent system. It provides a centralized mechanism for handling template files stored on disk, substituting variables into template strings, and caching results to improve performance. This component enables dynamic prompt generation without requiring code changes when templates need to be updated or customized.

## Key Functionality

**Template Variable Substitution**

The `renderTemplate` function substitutes `{{variable}}` placeholders in template strings with provided values. It validates that all required variables are present in the input object, providing clear error messages when variables are missing.

**File-Based Template Loading**

The `getTemplate` function loads template files from a configurable prompts directory on disk. It implements caching to avoid repeated file system reads for the same template, improving performance across multiple prompt generations. Missing template files trigger descriptive errors to aid debugging.

**Convenience Rendering**

The `render` method combines template loading and variable substitution in a single operation, streamlining the common use case of fetching and rendering a template with context-specific variables.

## Relationships

- **Agent implementations** use `PromptManager` to generate dynamic prompts tailored to specific contexts or user inputs
- **Template files** are stored as `.txt` files in a configurable prompts directory
- Variable substitution enables **context-aware prompt customization**, allowing agents to modify their behavior based on runtime data without code changes

## Usage Example

```javascript
const PromptManager = require('./lib/prompts');

const promptManager = new PromptManager();

// Render a template string with variable substitution
const template = 'Hello {{name}}, you are {{age}} years old.';
const variables = { name: 'Alice', age: 30 };
const result = promptManager.renderTemplate(template, variables);
// Result: "Hello Alice, you are 30 years old."

// Load and render a template file in one call
const prompt = promptManager.render('agent-system-prompt', {
  agentName: 'ResearchBot',
  capabilities: 'web search, document analysis'
});
```

## Testing

The `PromptManager` component has comprehensive test coverage with **20 test cases** organized into **7 test suites** across `tests/unit/prompts.test.js`. Test coverage includes:

- `renderTemplate` functionality with single and multiple variable occurrences
- `getTemplate` file loading and caching behavior
- `render` convenience method combining loading and rendering
- Template-specific tests for code-analysis, documentation-writer, and meta-analysis templates
- Error handling for missing variables and template files