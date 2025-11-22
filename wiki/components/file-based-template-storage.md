---
title: File-based template storage
category: components
related: []
created: 2025-11-22
updated: 2025-11-22
---

# File-based Template Storage

## Purpose and Overview

The file-based template storage system provides a foundation for dynamic prompt generation by loading template files from the filesystem and performing variable substitution. This system enables agents to use reusable prompt templates with placeholder variables that can be populated at runtime.

## Key Functionality

### Template Loading and Caching
- **Template Storage**: Templates are stored as `.txt` files in the `lib/prompts` directory
- **Caching Mechanism**: Implements file-based caching to avoid repeated filesystem reads for the same template
- **File System Integration**: Uses Node.js `fs` and `path` modules for reliable file operations

### Variable Substitution
- **Placeholder Syntax**: Uses `{{variable}}` syntax for template placeholders
- **Dynamic Rendering**: Replaces placeholders with actual values provided at render time
- **Template Pattern**: Implements the template design pattern for consistent prompt generation

### Core Components

#### PromptManager Class
Main orchestrator that handles template loading, caching, and rendering operations.

#### Key Methods
- `getTemplate()` - Loads template content from filesystem with built-in caching
- `renderTemplate()` - Performs variable substitution on template strings
- `render()` - Convenience method combining loading and rendering in a single operation

## Relationships

- **Agent System Foundation**: Provides the underlying prompt management infrastructure for AI agents
- **File System Dependency**: Relies on standardized directory structure (`lib/prompts`) for template organization
- **Runtime Integration**: Connects with agent execution flows to provide dynamic prompt content

## Usage Examples

### Basic Template Rendering
```javascript
const promptManager = new PromptManager();

// Load and render template with variables
const prompt = await promptManager.render('greeting', {
  name: 'Alice',
  role: 'developer'
});
```

### Template File Structure
```
lib/prompts/
├── greeting.txt
├── analysis.txt
└── summary.txt
```

### Template Content Example
```text
Hello {{name}}! You are working as a {{role}} on this project.
Please review the following code and provide feedback.
```