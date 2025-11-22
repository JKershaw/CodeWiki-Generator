---
title: Self-documentation pattern
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Self-documentation Pattern

## Purpose and Overview

The self-documentation pattern enables a codebase to generate comprehensive documentation about itself by analyzing its own git history. This approach provides an automated way to create wiki documentation without requiring external API access or manual intervention.

## Key Functionality

### Local Git Integration

The system extracts structured data directly from the local git repository using shell commands:

- **Commit History**: Retrieves commit metadata including SHA, author, date, and message
- **File Changes**: Identifies added, modified, and deleted files for each commit
- **Diff Analysis**: Captures actual code changes to understand what was modified

```javascript
// Example of extracted commit data structure
{
  sha: "abc123...",
  author: { name: "Developer Name", email: "dev@example.com" },
  date: "2024-01-15T10:30:00Z",
  message: "Add new feature",
  files: [
    { filename: "src/feature.js", status: "added", patch: "..." }
  ]
}
```

### GitHub Client Mocking

The pattern overrides the standard GitHub API client interface to use local data instead of remote calls. This allows the existing `Processor` class to work seamlessly with local git data by:

- Implementing the same interface expected by `processor.githubClient`
- Transforming git command output into the format expected by the processing pipeline
- Maintaining compatibility with existing documentation generation logic

### Processing Pipeline

The self-documentation workflow:

1. **Setup**: Creates a mocked GitHub client that returns local git data
2. **Analysis**: Uses the existing `Processor` class to analyze commits and changes
3. **Generation**: Produces wiki documentation following the same patterns as GitHub-based generation

## Relationships

- **Extends**: Built on top of the existing `Processor` class from `lib/processor`
- **Mimics**: GitHub API client interface for seamless integration
- **Reuses**: Same documentation analysis and generation pipeline as remote processing

## Usage Examples

### Basic Self-Documentation

```bash
node generate-self-wiki.js
```

This generates documentation for the current repository by analyzing its complete git history.

### Integration Patterns

The local git integration techniques can be adapted for other use cases:

```javascript
const commits = getLocalCommits();
// Process commits for custom analysis beyond documentation
```

The mocking pattern demonstrates how to substitute data sources while maintaining existing processing logic, useful for testing or alternative data sources.