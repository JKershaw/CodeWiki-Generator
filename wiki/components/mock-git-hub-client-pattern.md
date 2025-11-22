---
title: Mock GitHub client pattern
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Mock GitHub Client Pattern

## Purpose and Overview

The Mock GitHub client pattern demonstrates how to substitute data sources while maintaining the same processing interface. This pattern enables the CodeWiki-Generator to work with local git repositories instead of requiring GitHub API access, making it useful for offline documentation generation and cost-aware processing.

## Key Functionality

The pattern replaces GitHub API calls with local git commands while preserving the expected data structure:

- **Local Git Integration**: Uses direct `git log` commands to extract commit history and file changes from the local repository
- **Interface Compatibility**: Maintains the same data format expected by the Processor class, ensuring seamless substitution
- **Self-Documentation**: Enables the documentation generator to document itself without external API dependencies

### Core Implementation

The `getLocalCommits` function serves as the mock client:

```javascript
// Replaces github.rest.repos.listCommits() with local git commands
const commits = await getLocalCommits(owner, repo, { per_page: 10 });

// Maintains expected data structure for processor compatibility
return commits.map(commit => ({
  sha: commit.sha,
  commit: {
    message: commit.message,
    author: { name: commit.author, date: commit.date }
  }
}));
```

## Relationships

- **Extends Processor Interface**: Uses `lib/processor.js` as the core documentation engine without modification
- **Substitutes GitHub API**: Provides local git data in place of `@octokit/rest` API responses
- **Enables Self-Documentation**: Powers `generate-self-wiki.js` to create documentation for the project itself
- **Demonstrates Flexibility**: Shows how the processor can work with different data sources beyond GitHub

## Usage Examples

### Basic Self-Documentation

```javascript
const processor = new Processor(owner, repo, {
  maxCost: 2.00,
  outputDir: './wiki'
});

// Mock the GitHub client with local git data
processor.github = { 
  rest: { 
    repos: { 
      listCommits: () => getLocalCommits(owner, repo) 
    } 
  } 
};

await processor.generateWiki();
```

### Custom Data Source Integration

The pattern can be adapted for other git hosting providers:

```javascript
// Could replace with GitLab, Bitbucket, or any git source
const mockClient = {
  rest: {
    repos: {
      listCommits: () => getCustomGitData(source, options)
    }
  }
};
```

This pattern proves the Processor class design is flexible enough to work with any data source that provides commit and file change information in the expected format.