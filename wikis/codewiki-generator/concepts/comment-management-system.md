---
title: Comment management system
category: concept
sourceFile: lib/comments-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Comment Management System

## Purpose and Overview

The Comment Management System provides a complete commenting infrastructure for wiki pages with CRUD operations, resolution tracking, and file-based persistence. It enables collaborative feedback on wiki content by allowing users to add, modify, resolve, and analyze comments across different pages within projects.

## Key Functionality

The `CommentsManager` class handles all comment operations through the following capabilities:

- **Comment CRUD Operations**: Create, read, update, and delete comments with unique ID generation and timestamp tracking
- **Resolution Workflow**: Toggle comment resolution status with timestamp tracking for lifecycle management
- **Statistics and Analytics**: Generate comment metrics including resolution counts and per-page distribution
- **File-based Persistence**: Store comment data in JSON files organized by project with automatic directory creation
- **Sorted Retrieval**: Return comments ordered by timestamp for consistent display

Each comment includes metadata such as author, content, creation/modification timestamps, and resolution status. The system uses a combination of timestamp and random string for unique ID generation.

## Relationships

The Comment Management System integrates seamlessly with the existing wiki infrastructure:

- Follows the same project-based file organization pattern as other wiki components
- Complements page content by providing a collaborative feedback layer
- Uses consistent file-based storage approach matching the wiki's architecture
- Organizes comments by page ID, allowing tight integration with wiki page routing

## Usage Example

```javascript
const CommentsManager = require('./lib/comments-manager');

// Initialize for a wiki project
const commentsManager = new CommentsManager('./wikis');
const pageId = 'concepts/architecture.md';
const project = 'test-project';

// Add a new comment
await commentsManager.addComment(project, pageId, 'Alice', 'Great explanation!');

// Retrieve all comments for a page
const comments = await commentsManager.getComments(project, pageId);

// Resolve a comment
await commentsManager.resolveComment(project, 'comment_1');

// Get project statistics
const stats = await commentsManager.getStatistics(project);
```

## Testing

**Test Coverage**: `tests/unit/comments-manager.test.js`
- 12 test cases across 7 test suites
- Comprehensive coverage of all CRUD operations
- Tests for comment resolution workflow and statistics generation
- Error handling validation for file operations