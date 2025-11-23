---
title: AI Agent System
category: components
created: 2025-11-22
updated: 2025-11-22
related:
  - claude-client
  - prompt-manager
  - agents/code-analysis
  - agents/documentation-writer
  - agents/meta-analysis
---

# AI Agent System

## Purpose and Overview

The AI Agent System consists of three specialized agents that work together to analyze code changes and generate wiki documentation. Each agent uses Claude via the ClaudeClient wrapper and renders prompts via the PromptManager. The agents form a pipeline: code analysis → documentation writing → meta-analysis.

## Architecture

```
Git Commit
    ↓
CodeAnalysisAgent
    ↓ (structured analysis)
DocumentationWriterAgent
    ↓ (markdown content)
WikiManager
    ↓ (every N commits)
MetaAnalysisAgent
    ↓ (recommendations)
Human Review
```

## The Three Agents

### 1. CodeAnalysisAgent

**Purpose**: Analyze code changes to extract key concepts and elements

**Input**:
- File path
- Code diff
- Commit message
- Related wiki pages

**Output**: JSON structure
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

**Model**: claude-sonnet-4-20250514, 2000 max tokens

**Key Features**:
- Filters insignificant files (tests, config, docs, build artifacts)
- Truncates large diffs to 2000 lines
- Preserves context (60% start, 30% end when truncating)

### 2. DocumentationWriterAgent

**Purpose**: Generate or update wiki documentation from code analysis

**Input**:
- Concept/component name
- Code analysis (from CodeAnalysisAgent)
- Existing documentation (if updating)

**Output**: Markdown documentation with standard structure:
- Purpose and Overview
- Key Functionality
- Relationships
- Usage Examples (if relevant)

**Model**: claude-sonnet-4-20250514, 3000 max tokens

**Key Features**:
- Sanitizes responses (removes code block wrappers)
- Merges with existing documentation intelligently
- Focuses on clarity over completeness
- Keeps documentation under 500 words unless complexity requires more

### 3. MetaAnalysisAgent

**Purpose**: Identify patterns across multiple commits and suggest improvements

**Input**:
- List of concepts identified
- List of pages created/updated

**Output**: JSON structure
```json
{
  "themes": ["Authentication system being built"],
  "newPagesNeeded": [
    {
      "title": "Security Architecture",
      "reason": "Multiple auth commits suggest need for overview",
      "category": "concepts"
    }
  ],
  "gaps": ["Missing error handling documentation"],
  "reorganization": [
    {
      "action": "split",
      "target": "LargePage",
      "reason": "Page too long, covers multiple topics"
    }
  ]
}
```

**Model**: claude-sonnet-4-20250514, 2000 max tokens

**Key Features**:
- Runs at configurable frequency (default: every 5 commits)
- Identifies architectural patterns
- Suggests high-value documentation additions
- Recommends page reorganization (split, merge, rename)

## Common Patterns

### Test-Driven Design

All agents follow TDD:
1. Write comprehensive tests first
2. Implement to pass tests
3. Validate with real API calls manually

Tests mock ClaudeClient to avoid API costs during development.

### Configuration

All agents use consistent configuration:
- Model: claude-sonnet-4-20250514
- Max tokens: 2000-3000 depending on task
- Retry logic: Inherited from ClaudeClient
- Cost tracking: Automatic via ClaudeClient

### Error Handling

Agents handle errors at multiple levels:
- **API errors**: Propagate from ClaudeClient (with retries)
- **Invalid responses**: Validate and normalize structure
- **Missing fields**: Provide defaults (empty arrays, sensible values)

### Response Validation

JSON-returning agents validate responses:

```javascript
_validateResponse(response) {
  return {
    concepts: Array.isArray(response.concepts) ? response.concepts : [],
    codeElements: Array.isArray(response.codeElements) ? response.codeElements : [],
    relationships: Array.isArray(response.relationships) ? response.relationships : []
  };
}
```

This ensures downstream code can safely assume proper structure.

## Relationships

- **All agents use**: ClaudeClient for API calls
- **All agents use**: PromptManager for prompt rendering
- **CodeAnalysisAgent** → feeds → **DocumentationWriterAgent**
- **MetaAnalysisAgent** → reviews output of other agents
- **WikiManager** → stores output from DocumentationWriterAgent

## Integration with Processor

The processor (Phase 3) will orchestrate these agents:

1. Fetch commits from GitHub
2. For each commit:
   - Filter significant files
   - Run CodeAnalysisAgent on each file
   - Determine which wiki pages to create/update
   - Run DocumentationWriterAgent
   - Update wiki pages via WikiManager
3. Every N commits:
   - Run MetaAnalysisAgent
   - Present recommendations to user

## Testing

The agent system has 43 tests across 3 agents:
- CodeAnalysisAgent: 15 tests
- DocumentationWriterAgent: 13 tests
- MetaAnalysisAgent: 15 tests

All tests use mocked ClaudeClient to verify:
- Prompt construction
- Parameter passing
- Response handling
- Error cases
- Edge cases (empty inputs, large inputs)

## Design Rationale

**Why separate agents vs one large agent?**
- Separation of concerns (analyze, write, review)
- Easier to test each responsibility
- Can reuse agents independently
- Clear interfaces between stages

**Why JSON + Markdown outputs?**
- JSON for structured data that code processes
- Markdown for human-readable documentation
- Type safety through validation

**Why configurable meta-analysis frequency?**
- Running on every commit is expensive
- Patterns emerge over multiple commits
- User can adjust based on project size/budget
