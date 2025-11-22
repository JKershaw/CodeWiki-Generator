---
title: Local git integration
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Local Git Integration

## Purpose and Overview

The local git integration provides direct access to git repository history without requiring external APIs, enabling offline documentation generation and serving as the data source for the self-documentation workflow. This component demonstrates how to substitute GitHub's API with local git commands while maintaining the same processing interface.

## Key Functionality

### Data Extraction
- **`getLocalCommits()`** - Executes git commands to extract commit history and file changes directly from the local repository
- Retrieves recent commits with full diff information for analysis
- Formats git output to match the expected data structure for the processor

### Self-Documentation Process
- **`generate-self-wiki.js`** - Standalone script that generates wiki documentation for the CodeWiki-Generator project itself
- Creates a bootstrap process where the documentation generator documents its own codebase
- Implements cost-aware processing with configurable budget limits for AI API usage

### Mock GitHub Pattern
- Replaces the GitHub client with local git data while preserving the processor interface
- Demonstrates adapter pattern for different data sources (local git vs GitHub API)
- Maintains compatibility with existing processor workflows

## Relationships

- **Uses** `lib/processor.js` as the core documentation engine
- **Replaces** GitHub API calls with local git command execution
- **Outputs** to `wiki/` directory for direct repository inclusion
- **Demonstrates** the Processor class interface through practical mocking

## Usage Examples

### Running Self-Documentation
```bash
node generate-self-wiki.js
```

### Adapting for Other Projects
```javascript
// Customize for different repositories
const commits = await getLocalCommits();
const processor = new Processor({
  client: { /* mock GitHub client with local data */ },
  costLimit: 5.00
});
```

### Setting Cost Limits
```javascript
const processor = new Processor({
  // ... other config
  costLimit: 10.00  // Set maximum AI API spend
});
```

This integration enables offline documentation generation and provides a template for adapting the system to work with different git hosting providers or local development workflows.