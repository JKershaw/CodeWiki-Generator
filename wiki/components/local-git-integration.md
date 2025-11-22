---
title: Local git integration
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Local Git Integration

The local git integration enables the codebase documentation system to analyze and document itself by examining its own git repository directly, bypassing external APIs. This self-documenting capability allows the system to generate comprehensive documentation from its own development history and code changes.

## Key Functionality

### Self-Documentation Processing
The system uses the existing `Processor` class but replaces the GitHub API client with a mock that sources data from local git commands. This approach maintains all existing analysis capabilities while operating entirely on local repository data.

### Git History Extraction
The `getLocalCommits` function extracts detailed commit information including:
- Commit metadata (hash, author, date, message)
- File changes and modifications
- Code patches and diffs
- Branch and merge information

### Cost-Aware Analysis
Local processing applies the same cost limiting mechanisms as external repository analysis, preventing excessive API usage during documentation generation even when analyzing local data.

## Relationships

- **Extends** the main `Processor` class from `lib/processor`
- **Replaces** GitHub API calls with local git command execution
- **Outputs** to the same wiki directory structure as external repository analysis
- **Applies** identical processing logic and cost controls as remote analysis

## Usage

The self-documentation script runs independently of the main processor:

```bash
node generate-self-wiki.js
```

The system automatically:
1. Configures a processor instance with local git integration
2. Extracts commit history and file changes from the current repository
3. Generates documentation using the same analysis pipeline as external repositories
4. Outputs structured wiki documentation to the standard directory

## Mock Client Pattern

The local integration implements a mock client pattern that substitutes external API calls with local data sources. This allows the existing processor architecture to work seamlessly with local git data while maintaining compatibility with all existing analysis and documentation generation features.