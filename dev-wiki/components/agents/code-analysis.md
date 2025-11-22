---
title: Code Analysis Agent
category: components
created: 2025-11-22
updated: 2025-11-22
related:
  - claude-client
  - prompt-manager
  - agents/overview
  - agents/documentation-writer
---

# Code Analysis Agent

## Purpose and Overview

The `CodeAnalysisAgent` is the first stage in the documentation pipeline. It analyzes code changes from git commits to extract high-level concepts, identify code elements (classes, functions, modules), and understand relationships between components. This structured analysis feeds the DocumentationWriterAgent.

## Key Functionality

### Main Method: analyzeCode()

```javascript
async analyzeCode(filePath, fileDiff, commitMessage, relatedPages = [])
```

**Inputs**:
- `filePath`: Path to changed file (e.g., `src/auth/service.js`)
- `fileDiff`: Git diff showing changes
- `commitMessage`: Commit message providing context
- `relatedPages`: Array of existing wiki pages that might be related

**Output**: Structured JSON
```json
{
  "concepts": ["Authentication", "Session Management"],
  "codeElements": [
    {
      "name": "AuthService",
      "type": "class",
      "purpose": "Handles user authentication flow"
    }
  ],
  "relationships": ["uses SessionManager", "called by UserController"]
}
```

### File Filtering: isSignificantFile()

Not all files warrant documentation. The agent filters out:

- **Configuration files**: package.json, tsconfig.json, .eslintrc.js
- **Lock files**: package-lock.json, yarn.lock
- **Test files**: *.test.js, *.spec.ts
- **Documentation**: README.md, *.md in docs/
- **Build artifacts**: Files in dist/, build/, .next/

This focuses analysis on actual implementation code.

### Diff Truncation

Large diffs are truncated to stay within token limits:
- Maximum 2000 lines
- Keeps first 60% and last 30% when truncating
- Preserves beginning (context) and end (final state)
- Adds truncation marker in middle

Example:
```javascript
_truncateDiff(diff) {
  const lines = diff.split('\n');
  if (lines.length <= this.maxDiffLines) {
    return diff;
  }

  const keepStart = Math.floor(this.maxDiffLines * 0.6);
  const keepEnd = Math.floor(this.maxDiffLines * 0.3);

  return [
    ...lines.slice(0, keepStart),
    `... [${lines.length - this.maxDiffLines} lines truncated] ...`,
    ...lines.slice(-keepEnd)
  ].join('\n');
}
```

## Prompt Template

Uses `code-analysis.txt` template with variables:
- `{{filePath}}`: File being analyzed
- `{{diff}}`: Code changes (truncated if needed)
- `{{commitMessage}}`: Commit context
- `{{relatedPages}}`: Existing related documentation

The prompt instructs Claude to:
1. Identify high-level concepts introduced or modified
2. Extract key code elements (classes, functions, types)
3. Understand relationships with other code
4. Return **only valid JSON**

## Configuration

- **Model**: claude-sonnet-4-20250514
- **Max tokens**: 2000
- **Max diff lines**: 2000

## Error Handling

The agent handles several error cases:

**API Errors**: Propagated from ClaudeClient (which includes retry logic)

**Invalid JSON Responses**: ClaudeClient's `sendMessageJSON()` handles parsing and extraction

**Missing Response Fields**: Not currently validated (assumes Claude returns proper structure)

## Usage Example

```javascript
const CodeAnalysisAgent = require('./lib/agents/code-analysis-agent');

const agent = new CodeAnalysisAgent();

// Check if file is worth analyzing
if (!agent.isSignificantFile('package-lock.json')) {
  console.log('Skipping insignificant file');
  return;
}

// Analyze a code change
const analysis = await agent.analyzeCode(
  'src/auth/service.js',
  diffString,
  'Add JWT token validation',
  ['components/auth-middleware.md']
);

console.log('Concepts:', analysis.concepts);
console.log('Elements:', analysis.codeElements);
```

## Testing

The agent has 15 tests covering:

- **Happy path**: Successful analysis with proper structure
- **Prompt construction**: Verifies all inputs included in prompt
- **Related pages formatting**: Lists formatted properly
- **Empty inputs**: Handles empty related pages
- **Large diffs**: Truncation works correctly
- **Configuration**: Uses correct model and token limits
- **Error handling**: API errors propagate properly
- **File filtering**: All file type rules work correctly

## Relationships

- **Uses**: ClaudeClient for API calls
- **Uses**: PromptManager for prompt rendering
- **Feeds**: DocumentationWriterAgent (provides analysis)
- **Called by**: Processor (once implemented in Phase 3)

## Design Decisions

**Why filter files vs analyze everything?**
- Saves API costs
- Reduces noise in documentation
- Focuses on actual implementation

**Why truncate diffs?**
- Large files exceed token limits
- Most context is at start and end
- Middle of large diffs often repetitive

**Why structured JSON output?**
- Enables programmatic processing
- Clear contract with DocumentationWriterAgent
- Type-safe downstream usage

**Why include related pages as input?**
- Helps Claude understand existing documentation structure
- Can reference established terminology
- Avoids duplicating information
