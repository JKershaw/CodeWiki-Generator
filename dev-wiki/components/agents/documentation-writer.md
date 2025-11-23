---
title: Documentation Writer Agent
category: components
created: 2025-11-22
updated: 2025-11-22
related:
  - claude-client
  - prompt-manager
  - agents/overview
  - agents/code-analysis
  - wiki-manager
---

# Documentation Writer Agent

## Purpose and Overview

The `DocumentationWriterAgent` generates human-readable markdown documentation from the structured analysis produced by the CodeAnalysisAgent. It creates new documentation pages or updates existing ones, maintaining a consistent structure and writing style across the wiki.

## Key Functionality

### Main Method: writeDocumentation()

```javascript
async writeDocumentation(conceptName, codeAnalysis, existingContent = '')
```

**Inputs**:
- `conceptName`: Name of the concept or component being documented
- `codeAnalysis`: Structured analysis from CodeAnalysisAgent (or string)
- `existingContent`: Current documentation content if updating (optional)

**Output**: Markdown string with standard documentation structure

Example output:
```markdown
# AuthService

## Purpose and Overview

The AuthService class handles user authentication and session management
for the application. It provides methods for login, logout, and token
validation.

## Key Functionality

- **Login**: Validates credentials and creates session
- **Logout**: Destroys session and invalidates tokens
- **Token Validation**: Verifies JWT tokens for protected routes

## Relationships

- Uses SessionManager for session storage
- Called by UserController for authentication endpoints
- Integrates with DatabaseConnection for user lookup

## Usage Example

...
```

### Input Handling

The agent handles both string and object inputs for code analysis:

```javascript
const analysisText = typeof codeAnalysis === 'string'
  ? codeAnalysis
  : JSON.stringify(codeAnalysis, null, 2);
```

This flexibility allows:
- Passing structured JSON from CodeAnalysisAgent
- Passing custom string descriptions
- Supporting future analysis formats

### Existing Content Handling

When updating documentation:
- Pass existing markdown as `existingContent`
- Agent merges new insights with existing structure
- Preserves valuable existing information
- Updates outdated sections

When `existingContent` is empty:
- Formatted as "None (creating new documentation)"
- Agent knows to create fresh content
- Uses standard documentation template

### Markdown Sanitization

Claude sometimes wraps markdown responses in code blocks. The `sanitizeMarkdown()` method removes these wrappers:

```javascript
sanitizeMarkdown(markdown) {
  let cleaned = markdown.trim();

  // Match: ```markdown\n...\n``` or ```\n...\n```
  const codeBlockMatch = cleaned.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```$/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  return cleaned;
}
```

**Before**:
````
```markdown
# Component Name

Content here...
```
````

**After**:
```markdown
# Component Name

Content here...
```

## Prompt Template

Uses `documentation-writer.txt` template with variables:
- `{{conceptName}}`: What is being documented
- `{{codeAnalysis}}`: Structured or string analysis
- `{{existingContent}}`: Current docs or "None"

The prompt instructs Claude to:
1. Write clear, concise documentation
2. Include standard sections (Purpose, Functionality, Relationships, Usage)
3. Write in present tense
4. Be specific and accurate
5. Keep under 500 words unless complexity requires more
6. Use markdown formatting
7. If updating, preserve structure and merge insights
8. **Output only markdown** (no preamble, no JSON wrapper)

## Configuration

- **Model**: claude-sonnet-4-20250514
- **Max tokens**: 3000 (higher than analysis agent due to output length)

## Documentation Structure

All generated documentation follows this structure:

### 1. Purpose and Overview (Required)
2-3 sentences explaining what the component is and why it exists

### 2. Key Functionality (Required)
What it does and how it works (bullet points or paragraphs)

### 3. Relationships (Required)
How it connects to other components

### 4. Usage Examples (Optional)
Included when relevant and not obvious from the code

Additional sections may be added based on complexity.

## Usage Example

```javascript
const DocumentationWriterAgent = require('./lib/agents/documentation-writer-agent');

const agent = new DocumentationWriterAgent();

// Create new documentation
const markdown = await agent.writeDocumentation(
  'AuthService',
  {
    concepts: ['Authentication', 'JWT'],
    codeElements: [{ name: 'AuthService', type: 'class', purpose: 'Handles auth' }],
    relationships: ['uses SessionManager']
  },
  '' // No existing content
);

// Update existing documentation
const updated = await agent.writeDocumentation(
  'AuthService',
  { /* new analysis */ },
  existingMarkdown // Preserve and merge
);

// Write to wiki
const wikiManager = new WikiManager();
await wikiManager.createPage('components/auth-service', 'AuthService', markdown);
```

## Testing

The agent has 13 tests covering:

- **Happy path**: Successful markdown generation
- **Prompt construction**: Concept name and analysis included
- **Existing content**: Properly handled for updates
- **Empty existing content**: Formatted appropriately
- **Code analysis formats**: Handles both objects and strings
- **Configuration**: Correct model and token limits
- **Error handling**: API errors propagate
- **Markdown sanitization**: All wrapper formats removed
- **Preserving internal code blocks**: Sanitization doesn't break content

## Relationships

- **Uses**: ClaudeClient for API calls
- **Uses**: PromptManager for prompt rendering
- **Fed by**: CodeAnalysisAgent (receives structured analysis)
- **Feeds**: WikiManager (provides markdown content)
- **Called by**: Processor (once implemented in Phase 3)

## Design Decisions

**Why separate from CodeAnalysisAgent?**
- Separation of concerns (analysis vs writing)
- Different prompt styles and models potentially
- Can reuse writer for non-code documentation
- Easier testing of each stage

**Why sanitize markdown?**
- Claude inconsistently wraps responses in code blocks
- Prevents broken wiki pages with triple backticks
- Ensures clean markdown storage
- Preserves intentional code blocks within content

**Why support existing content?**
- Documentation should evolve, not be rewritten
- Preserves manual edits and improvements
- Enables incremental updates
- Better than full regeneration

**Why standard structure?**
- Consistent reading experience
- Easier to find information
- Sets quality bar for all docs
- Guides Claude's writing style

**Why higher token limit (3000 vs 2000)?**
- Generated documentation is the output
- Complex components need detailed explanations
- Still constrained to keep docs concise
- Analysis agent only produces JSON (smaller)
