---
title: Git history integration
category: concept
sourceFile: lib/git-history-service.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Git History Integration

## Purpose and Overview

The Git history integration provides version control awareness for wiki pages by exposing commit history, blame information, and diff visualization directly within the wiki interface. This service bridges git repositories with wiki functionality, enabling collaborative documentation tracking and authorship attribution.

## Key Functionality

The `GitHistoryService` class offers comprehensive git operations for wiki projects:

- **Repository validation** - Verifies git repository existence and accessibility
- **Page history tracking** - Retrieves chronological commit history for specific wiki pages
- **Commit analysis** - Provides detailed commit information including diffs and metadata
- **Blame functionality** - Shows line-by-line authorship and modification history
- **Statistics generation** - Calculates contributor metrics and page activity data
- **Recent activity monitoring** - Tracks recent commits across the entire repository

The service operates on project directories, validating git instances before performing operations and handling repository-specific contexts for each wiki project.

## Relationships

This component extends the core wiki functionality by adding version control awareness to the existing project-based structure. It integrates with:

- **Project management system** - Operates within individual project directories that contain both wiki content and git repositories
- **Wiki page rendering** - Provides historical context and authorship data for documentation pages  
- **Dashboard features** - Supplies activity data and statistics for project overview displays

The service acts as an adapter layer between the wiki's content management and underlying git repositories.

## Usage Example

```javascript
const GitHistoryService = require('./lib/git-history-service');

const gitService = new GitHistoryService();

// Check if project has git repository
const hasRepo = await gitService.hasGitRepo(projectPath);

// Get commit history for a wiki page
const history = await gitService.getPageHistory(projectPath, 'docs/api.md');

// Get blame information for line-by-line authorship
const blame = await gitService.getBlame(projectPath, 'docs/api.md');

// Retrieve recent commits across the project
const recentCommits = await gitService.getRecentCommits(projectPath);
```

## Testing

No automated test coverage is currently available for this component.