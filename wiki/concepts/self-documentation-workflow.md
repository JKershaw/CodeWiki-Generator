---
title: Self-documentation workflow
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Self-documentation Workflow

## Purpose and Overview

The self-documentation workflow enables the CodeWiki-Generator to create documentation for its own codebase, demonstrating a complete bootstrap process. This approach validates the documentation system while providing a practical template for documenting any local repository without requiring GitHub API access.

## Key Functionality

The workflow centers around `generate-self-wiki.js`, which adapts the standard documentation processor to work with local git data:

### Local Git Integration

- **`getLocalCommits()`** - Executes git commands directly to extract commit history and file changes
- Bypasses GitHub API limitations and enables offline processing
- Captures the same commit metadata structure expected by the processor

### Mock GitHub Client Pattern

The script demonstrates how to substitute data sources while maintaining interface compatibility:

```javascript
// Creates a mock GitHub client that uses local git data
const mockGitHub = {
  rest: {
    repos: {
      listCommits: async () => ({ data: commits }),
      getCommit: async ({ sha }) => ({ data: commitDetails[sha] })
    }
  }
};
```

### Cost-Aware Processing

Implements practical budget constraints for AI-powered documentation:

- Sets reasonable cost limits to prevent runaway API usage
- Balances documentation completeness with resource consumption
- Provides a template for production documentation workflows

## Relationships

- **Uses `lib/processor.js`** - Leverages the core documentation engine without modification
- **Outputs to `wiki/` directory** - Generates documentation that can be committed alongside source code
- **Demonstrates Processor interface** - Shows how to adapt the system for different data sources
- **Templates local workflows** - Provides a pattern for documenting private or offline repositories

## Usage Examples

### Basic Self-Documentation

```bash
node generate-self-wiki.js
```

### Customizing for Your Repository

Adapt the local git integration for different repository structures:

```javascript
const commits = await getLocalCommits({
  since: '2024-01-01',
  maxCount: 50,
  excludePaths: ['node_modules/', 'dist/']
});
```

### Adjusting Cost Limits

Configure budget constraints based on your needs:

```javascript
const processor = new Processor(repoInfo, mockGitHub, {
  maxCostUSD: 2.00,  // Adjust based on repository size
  stopOnLimit: true
});
```

This workflow serves as both a practical tool for maintaining the project's own documentation and a reference implementation for teams wanting to document repositories without external API dependencies.