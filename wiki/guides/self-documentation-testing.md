---
title: Self-Documentation Testing
category: guide
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Self-Documentation Testing

## Purpose and Overview

Self-documentation testing enables the codebase documentation tool to validate itself by processing its own repository. This approach provides both automated testing and demonstrates real-world output quality using local git operations instead of external API dependencies.

## Key Functionality

### Local Git Integration
The testing system bypasses GitHub API requirements by directly interfacing with the local git repository:

- **Commit Extraction**: Uses `git log` commands to retrieve commit history with file changes
- **Diff Generation**: Executes `git show` to capture detailed file modifications for each commit
- **Shell Integration**: Leverages Node.js `child_process.execSync` for direct git command execution

### GitHub Client Mocking
Implements dependency injection pattern to replace external API calls:

```javascript
const mockGitHubClient = {
  getCommits: () => getLocalCommits(),
  // ... other mocked methods
}
```

The mock client provides the same interface as the production GitHub client while sourcing data locally.

### Isolated Output Generation
- Processes the tool's own codebase as test data
- Outputs results to `generated-wiki/` directory to avoid conflicts with development documentation
- Maintains identical processing options and statistics as production workflow

## Relationships

The self-documentation testing integrates with core system components:

- **Dependencies**: Imports and instantiates the main `Processor` class from `lib/processor.js`
- **Input Source**: Replaces GitHub API client with local git command wrapper
- **Output Handling**: Uses same markdown generation and file writing systems as production
- **Configuration**: Applies identical processing options for consistent validation

### Component Structure
```
test-run-local.js
├── Imports Processor class
├── Implements getLocalCommits() function
├── Creates mocked GitHub client
└── Executes full processing pipeline
```

## Usage Examples

### Running Local Tests
```bash
node test/test-run-local.js
```

### Extending for Other Repositories
The local git integration pattern can be adapted for testing against different repositories by modifying the git command working directory:

```javascript
const result = execSync('git log --oneline -10', { 
  cwd: '/path/to/other/repo',
  encoding: 'utf8' 
});
```

This testing approach validates the tool's core functionality while providing a practical example of processing real development history without external service dependencies.