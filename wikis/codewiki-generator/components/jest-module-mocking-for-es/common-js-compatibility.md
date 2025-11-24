---
title: Jest module mocking for ES/CommonJS compatibility
category: component
sourceFile: tests/setup.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Jest Module Mocking for ES/CommonJS Compatibility

## Purpose and Overview

This test setup file provides Jest module mocks to resolve compatibility issues between ES modules and CommonJS test environments. It specifically mocks the `marked` markdown parsing library to ensure all 275 unit tests can run successfully without ES module import conflicts.

## Key Functionality

The setup file uses `jest.mock()` to create simplified mock implementations of external ES modules:

- **marked.parse** - Mock async function that wraps content in HTML paragraph tags for testing markdown parsing functionality
- **marked.parseInline** - Mock function that returns content unchanged for testing inline markdown parsing

These mocks eliminate the need to import actual ES modules during CommonJS test execution while providing predictable behavior for components that depend on markdown parsing functionality.

## Relationships

- Enables testing of components throughout the codebase that depend on the marked markdown parsing library
- Part of the core test infrastructure that ensures compatibility between ES module dependencies and CommonJS test environments
- Required for the full test suite to execute without module import/export errors

## Usage Example

```javascript
// tests/setup.js is automatically loaded by Jest configuration
// The mocks are available in all test files without explicit imports

// In any test file, the marked library will use the mocked functions:
const marked = require('marked');

// This will use the mocked parse function
const result = await marked.parse('# Hello World');
// Returns: '<p># Hello World</p>'

// This will use the mocked parseInline function  
const inline = marked.parseInline('**bold text**');
// Returns: '**bold text**'
```

## Testing

This setup file itself has no automated tests as it serves as testing infrastructure. It enables the execution of all 275 unit tests in the codebase by resolving ES module compatibility issues.