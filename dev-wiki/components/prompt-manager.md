---
title: Prompt Manager
category: components
created: 2025-11-22
updated: 2025-11-22
related:
  - claude-client
  - agents/code-analysis
  - agents/documentation-writer
  - agents/meta-analysis
---

# Prompt Manager

## Purpose and Overview

The `PromptManager` class provides a template system for AI prompts. It loads prompt templates from text files, performs variable substitution, and validates that all required variables are provided. This centralizes prompt engineering and makes prompts maintainable and reusable across the agent system.

## Key Functionality

### Template Loading

Templates are stored as `.txt` files in `lib/prompts/` directory:
- `code-analysis.txt`: Analyzes code changes and extracts concepts
- `documentation-writer.txt`: Generates markdown documentation
- `meta-analysis.txt`: Identifies patterns across multiple commits

Templates are loaded once and cached in memory for performance.

### Variable Substitution

Templates use `{{variableName}}` syntax for placeholders:

```
You are analyzing a code change.

File: {{filePath}}
Commit: {{commitMessage}}
Changes:
{{diff}}
```

The `render()` method replaces all placeholders with provided values:

```javascript
const prompt = promptManager.render('code-analysis', {
  filePath: 'src/auth.js',
  commitMessage: 'Add authentication',
  diff: '+ class AuthService {...}'
});
```

### Validation

The manager automatically validates that all required variables are provided:

1. Extracts all `{{variableName}}` patterns from template
2. Checks that each variable exists in the provided object
3. Throws descriptive error if any variables are missing

This prevents runtime errors from incomplete prompt rendering.

### Template Structure

Each template follows a consistent structure:
- **Context**: What the AI is doing and why
- **Inputs**: Variable placeholders for dynamic content
- **Task**: Clear instructions on what to produce
- **Format**: Expected output format (JSON, Markdown, etc.)
- **Guidelines**: Quality standards and constraints

## Prompt Templates

### code-analysis.txt

**Purpose**: Analyze code changes to extract concepts and elements

**Variables**: `filePath`, `diff`, `commitMessage`, `relatedPages`

**Output**: JSON with `concepts`, `codeElements`, `relationships`

**Used by**: CodeAnalysisAgent

### documentation-writer.txt

**Purpose**: Generate wiki documentation from code analysis

**Variables**: `conceptName`, `codeAnalysis`, `existingContent`

**Output**: Markdown documentation

**Used by**: DocumentationWriterAgent

### meta-analysis.txt

**Purpose**: Identify patterns and suggest improvements

**Variables**: `concepts`, `pageList`

**Output**: JSON with `themes`, `newPagesNeeded`, `gaps`, `reorganization`

**Used by**: MetaAnalysisAgent

## Relationships

- **Used by**: All AI agents for prompt rendering
- **Manages**: Template files in `lib/prompts/` directory
- **Validates**: Variable requirements at render time

## Implementation Details

### Template Caching

Templates are cached after first load to avoid repeated file I/O:

```javascript
this.templateCache = new Map();

getTemplate(templateName) {
  if (this.templateCache.has(templateName)) {
    return this.templateCache.get(templateName);
  }

  const content = fs.readFileSync(templatePath, 'utf-8');
  this.templateCache.set(templateName, content);
  return content;
}
```

### Variable Extraction

Required variables are extracted using regex:

```javascript
const varPattern = /{{(\\w+)}}/g;
const matches = template.matchAll(varPattern);
const requiredVars = [...matches].map(m => m[1]);
```

### Render Process

1. Load template (from cache if available)
2. Extract required variables
3. Validate all variables provided
4. Replace each `{{var}}` with its value
5. Return rendered prompt

## Usage Example

```javascript
const PromptManager = require('./lib/prompts');

const pm = new PromptManager();

// Render a template
const prompt = pm.render('documentation-writer', {
  conceptName: 'AuthService',
  codeAnalysis: '{ "purpose": "Handles authentication" }',
  existingContent: 'None'
});

// Missing variable throws error
try {
  pm.render('code-analysis', { filePath: 'test.js' }); // Missing diff, commitMessage
} catch (err) {
  console.log(err.message); // "Missing required variable: diff"
}
```

## Design Rationale

**Why template files vs inline strings?**
- Easier to iterate on prompts without touching code
- Non-developers can improve prompts
- Version control tracks prompt evolution
- Reduces code clutter in agent classes

**Why simple `{{var}}` syntax?**
- Easy to read and write
- No complex templating logic needed
- Clear validation errors
- Matches common templating conventions
