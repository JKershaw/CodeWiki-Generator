---
title: GitHub Integration
created: 2025-11-22
updated: 2025-11-22
related: [Processor, Architecture, Configuration]
---

# GitHub Integration

GitHubClient wraps the Octokit REST API to fetch repository data, commits, and file content with robust error handling and retry logic.

## Purpose

Provides a clean, testable interface to GitHub's API:
- Fetch repository metadata
- List commits chronologically
- Get detailed commit information with diffs
- Retrieve file content at specific commits
- Handle rate limiting and network errors gracefully

## Location

`lib/github.js`

## Key Features

### URL Parsing

Supports multiple GitHub URL formats:

```javascript
// HTTPS
parseRepoUrl('https://github.com/owner/repo')
parseRepoUrl('https://github.com/owner/repo.git')

// SSH
parseRepoUrl('git@github.com:owner/repo.git')

// All return: { owner: 'owner', repo: 'repo' }
```

### Repository Information

```javascript
const info = await github.getRepoInfo('owner', 'repo');
// {
//   name: 'repo',
//   fullName: 'owner/repo',
//   description: '...',
//   defaultBranch: 'main',
//   isPrivate: false
// }
```

### Commit History

Fetches commits in **chronological order** (oldest first):

```javascript
const commits = await github.getCommits('owner', 'repo');
// [
//   { sha: 'abc123', message: 'Initial commit', author: {...}, date: '...' },
//   { sha: 'def456', message: 'Second commit', ... },
//   ...
// ]
```

**Options**:
- `since`: ISO date string (filter by date)
- `until`: ISO date string
- `perPage`: Results per page (default: 100)

**Pagination**: Automatically fetches all pages until no more commits.

**Ordering**: GitHub returns newest first, GitHubClient reverses to oldest first for chronological processing.

### Detailed Commit Info

```javascript
const commit = await github.getCommit('owner', 'repo', 'abc123');
// {
//   sha: 'abc123',
//   message: 'Add feature',
//   author: { name: '...', email: '...', date: '...' },
//   date: '2025-11-22T10:00:00Z',
//   files: [
//     {
//       filename: 'src/index.js',
//       status: 'modified',
//       additions: 10,
//       deletions: 5,
//       changes: 15,
//       patch: '@@ -1,5 +1,10 @@\n-old\n+new'
//     }
//   ]
// }
```

The `patch` field contains the unified diff for AI analysis.

### File Content

```javascript
const content = await github.getFileContent('owner', 'repo', 'src/index.js', 'abc123');
// "const x = 1;\n..."

// Returns null for non-existent files
const missing = await github.getFileContent('owner', 'repo', 'nonexistent.js', 'abc123');
// null
```

Handles base64 decoding automatically.

## Error Handling & Retries

### Retry Strategy

Uses exponential backoff with configurable parameters:

- **Initial delay**: 2 seconds
- **Max retries**: 4 attempts
- **Backoff**: Delay doubles each retry (2s, 4s, 8s, 16s)

### Retry Conditions

**Will retry**:
- Rate limit errors (403 with "rate limit" message)
- Network errors (ECONNRESET, ETIMEDOUT, ENOTFOUND)

**Will NOT retry**:
- Authentication errors (401)
- Forbidden errors (403 without rate limit)
- 404 Not Found
- Other client errors (4xx)

### Example Retry Flow

```
Attempt 1: Request fails (rate limit)
Wait 2 seconds
Attempt 2: Request fails (rate limit)
Wait 4 seconds
Attempt 3: Request succeeds ✓
```

## Test Mode Behavior

In test mode (`TEST_MODE=true`):
- Octokit instance is `null` (not created)
- Tests inject mock Octokit
- No real API calls are made
- No actual API costs

In production mode:
- Octokit created with auth token
- Real API calls to GitHub
- Costs and rate limits apply

## Testing

**Tests**: `tests/unit/github.test.js`

**Coverage**: 18 tests covering:
- URL parsing (https, SSH, trailing slashes, invalid)
- Repository info fetching
- Commit listing (pagination, filtering, ordering)
- Detailed commit info
- File content (base64 decoding, binary files, 404s)
- Retry logic (rate limits, network errors, auth errors)
- Error handling

All tests use mocks - no real GitHub API calls.

## Usage Example

```javascript
const GitHubClient = require('./lib/github');
const github = new GitHubClient();

// Parse URL
const { owner, repo } = github.parseRepoUrl('https://github.com/user/project');

// Get repo info
const info = await github.getRepoInfo(owner, repo);
console.log(`Processing ${info.fullName} (${info.defaultBranch})`);

// Get commits chronologically
const commits = await github.getCommits(owner, repo, {
  since: '2025-01-01'
});

// Process each commit
for (const commit of commits) {
  const details = await github.getCommit(owner, repo, commit.sha);

  for (const file of details.files) {
    console.log(`${file.status}: ${file.filename}`);
    console.log(`Patch:\n${file.patch}`);
  }
}
```

## Configuration

GitHubClient respects the global config:

```javascript
// From lib/config.js
config.githubToken      // Personal access token
config.testMode         // Use mocks?
config.isTestMode()     // Check if testing
```

Token can also be passed to constructor:

```javascript
const github = new GitHubClient('ghp_custom_token');
```

## Design Decisions

### Why Lazy Load Octokit?

- **Test compatibility**: Octokit uses ES modules, Jest uses CommonJS
- **Performance**: Don't load heavy library if not needed
- **Clean tests**: Tests don't import Octokit at all

### Why Reverse Commit Order?

- **Chronological processing**: System processes oldest → newest
- **Natural flow**: Understand evolution from beginning
- **Matches git log --reverse**: Standard chronological order

### Why Exponential Backoff?

- **Rate limit recovery**: Gives GitHub time to reset limits
- **Network resilience**: Transient errors often resolve quickly
- **Politeness**: Don't hammer API with rapid retries

### Why Return Null for 404?

- **Expected condition**: Missing files are normal (e.g., deleted)
- **Cleaner code**: Caller can handle with simple `if (!content)`
- **No exceptions**: 404 isn't an error, it's information

### Why Auto-Pagination?

- **Completeness**: Ensures all commits are fetched
- **Simplicity**: Caller doesn't worry about pagination
- **Correctness**: Large repos work automatically

## Rate Limits

GitHub API rate limits (without token):
- **60 requests/hour** for unauthenticated
- **5,000 requests/hour** with token

For processing 100 commits:
- ~101 requests minimum (1 list + 100 details)
- More if fetching file contents

**Recommendation**: Always use a token for serious processing.

## Security Considerations

- Token stored in environment variable (never in code)
- Token not logged or exposed in errors
- Test mode never touches real tokens
- Tests use dummy values only

## Future Enhancements

- GraphQL API support (more efficient for bulk data)
- Webhook integration for real-time updates
- Commit caching to avoid re-fetching
- Parallel fetching for independent commits
- Secondary rate limit handling (more sophisticated backoff)
