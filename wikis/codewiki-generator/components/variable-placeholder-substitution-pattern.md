---
title: Variable placeholder substitution pattern
category: component
sourceFile: lib/prompts.js
related: [meta/overview.md, components/template-management-system-with-caching.md]
created: 2025-11-25
updated: 2025-11-25
---

# Variable Placeholder Substitution Pattern

## Purpose and [Overview](../meta/overview.md)

The variable placeholder substitution pattern implements a flexible template rendering system using `{{variable}}` syntax for dynamic content insertion. This pattern enables the creation of reusable prompt templates with validated variable substitution, ensuring all required context is provided before rendering.

## Key Functionality

- **Template Parsing**: Identifies and extracts `{{variable}}` placeholders from template strings
- **Variable Substitution**: Replaces placeholders with corresponding values from provided variable objects
- **Validation**: Ensures all required variables are present before rendering, preventing incomplete template output
- **Multiple Occurrence Support**: Handles templates where the same variable appears multiple times
- **Type Flexibility**: Supports various data types (strings, numbers, objects) as variable values

The pattern works by scanning template strings for the `{{variable}}` syntax, extracting variable names, validating that all required variables are provided in the input object, and performing string replacement to generate the final rendered content.

## Relationships

This pattern is a core component of the **[Template management system with caching](../components/template-management-system-with-caching.md)** provided by `PromptManager`. It serves as the rendering engine that powers dynamic prompt generation throughout the agent system, enabling flexible prompt composition without hardcoding specific values or contexts.

## Usage Example

```javascript
const { PromptManager } = require('./lib/prompts.js');

const promptManager = new PromptManager();

// Basic variable substitution
const template = 'Hello {{name}}, you are {{age}} years old.';
const variables = { name: 'Alice', age: 30 };

const result = promptManager.renderTemplate(template, variables);
// Output: "Hello Alice, you are 30 years old."
```

## Testing

**Test Coverage**: `tests/unit/prompts.test.js`
- 20 test cases across 7 test suites
- Comprehensive coverage of template rendering scenarios including multiple variable occurrences, missing variables, and edge cases
- Test categories include PromptManager functionality, renderTemplate method, getTemplate operations, and specialized template types (code-analysis, documentation-writer, meta-analysis)