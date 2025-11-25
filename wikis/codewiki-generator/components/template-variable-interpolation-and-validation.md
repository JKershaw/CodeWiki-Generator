---
title: Template variable interpolation and validation
category: component
sourceFile: lib/prompts.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Template Variable Interpolation and Validation

## Purpose and Overview

The template variable interpolation and validation component provides safe placeholder substitution in prompt templates using double-brace syntax (`{{variable}}`). This system ensures type safety by validating that all required variables are provided before rendering, preventing runtime failures from missing template variables.

## Key Functionality

- **Placeholder Detection**: Identifies `{{variable}}` placeholders within template strings using regex pattern matching
- **Variable Validation**: Checks that all detected placeholders have corresponding values in the provided variables object
- **Safe Substitution**: Replaces placeholders with actual values only after validation passes
- **Error Handling**: Throws descriptive errors when required variables are missing, making debugging easier
- **Type Flexibility**: Accepts variables of any type and converts them to strings during substitution

The validation occurs before any substitution takes place, ensuring templates are either fully rendered or fail cleanly with clear error messages.

## Relationships

This component is part of the larger **Template-based prompt management system** implemented in the PromptManager class. It works alongside:

- **File-based template storage with caching** - provides the template content that gets processed
- Template loading and caching mechanisms - supply the raw templates for variable substitution
- Agent interaction systems - consume the rendered templates for dynamic prompt generation

## Usage Example

```javascript
const PromptManager = require('./lib/prompts');

const promptManager = new PromptManager();

// Basic template rendering with variables
const template = 'Hello {{name}}, you are {{age}} years old.';
const variables = { name: 'Alice', age: 30 };

const result = promptManager.renderTemplate(template, variables);
// Output: "Hello Alice, you are 30 years old."
```

## Testing

**Test Coverage**: tests/unit/prompts.test.js
- 20 test cases across 7 test suites
- Comprehensive testing of variable interpolation scenarios including multiple occurrences, missing variables, and edge cases
- Integration testing with template loading and caching functionality
- Specific template validation for code-analysis, documentation-writer, and meta-analysis templates