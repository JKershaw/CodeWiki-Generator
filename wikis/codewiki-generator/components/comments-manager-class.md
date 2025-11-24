---
title: CommentsManager class
category: component
sourceFile: lib/comments-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# CommentsManager Class

## Purpose and Overview

The CommentsManager class provides a file-based commenting system for wiki pages, enabling collaborative annotation and discussion on wiki content. It stores comments as JSON files within project directories, organizing them by page ID to support threaded discussions without requiring a database.

## Key Functionality

The CommentsManager handles all comment CRUD operations through these core capabilities:

- **Comment Storage**: Persists comments as JSON files in the project directory structure
- **Page-centric Organization**: Groups comments by page ID for easy retrieval and management
- **Comment Lifecycle**: Supports creating, updating, deleting, and resolving comments
- **Metadata Tracking**: Automatically adds timestamps, unique IDs, and modification history
- **Analytics**: Provides statistics on comment counts, resolution rates, and per-page distribution

Comments include metadata such as author, timestamp, content, and resolution status. The system generates unique IDs using timestamp and random components, and maintains comments sorted by creation time.

## Relationships

- Integrates with existing wiki project structure by storing comments alongside wiki content
- Supports dashboard enhancement features for collaborative workflows  
- Provides the foundation for team-based wiki editing and review processes
- Uses file-based persistence that aligns with the wiki's project-centric architecture

## Usage Example

```javascript
const CommentsManager = require('./lib/comments-manager');

// Initialize with wiki base directory
const commentsManager = new CommentsManager('./wikis');
const pageId = 'concepts/architecture.md';

// Add a new comment
await commentsManager.addComment('test-project', pageId, 'Alice', 'Great explanation of the architecture!');

// Retrieve comments for a page
const comments = await commentsManager.getComments('test-project', pageId);

// Resolve a comment thread
await commentsManager.resolveComment('test-project', pageId, 'comment_1', true);

// Get project statistics
const stats = await commentsManager.getStatistics('test-project');
```

## Testing

**Test Coverage**: tests/unit/comments-manager.test.js
- 12 test cases across 7 test suites
- Covers all major functionality: getComments, addComment, updateComment, deleteComment, resolveComment, getStatistics
- Tests include error handling, data persistence, and comment lifecycle management