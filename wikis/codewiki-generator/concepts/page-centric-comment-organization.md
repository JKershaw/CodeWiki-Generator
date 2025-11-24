---
title: Page-centric comment organization
category: concept
sourceFile: lib/comments-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Page-centric comment organization

## Purpose and Overview

The Page-centric comment organization system enables collaborative annotation of wiki content by organizing comments around specific pages. This concept provides a structured approach for teams to discuss and provide feedback on wiki content through threaded discussions that persist alongside the documentation.

## Key Functionality

The system organizes comments by `pageId`, creating dedicated discussion spaces for each wiki page. Comments are stored as JSON files within project directories, eliminating the need for external databases. Each comment includes metadata such as author, timestamp, content, and resolution status, enabling teams to track discussion progress and mark conversations as resolved when complete.

Key capabilities include:
- **Page-based organization**: Comments are grouped by wiki page for contextual discussions
- **Thread management**: Support for creating, updating, and deleting comment threads
- **Resolution tracking**: Comments can be marked as resolved to indicate completed discussions
- **Analytics**: Statistics on comment counts, resolution rates, and per-page distribution
- **File-based persistence**: Comments stored as JSON files within project structure

## Relationships

This component integrates directly with the existing wiki project structure by storing comment data alongside wiki content. It supports dashboard enhancement features and provides the foundation for collaborative wiki editing workflows. The file-based approach ensures comments remain co-located with their associated documentation, maintaining project portability.

## Usage Example

```javascript
const CommentsManager = require('./lib/comments-manager');

// Initialize comments manager for wiki projects
const commentsManager = new CommentsManager('./wikis');
const pageId = 'concepts/architecture.md';

// Add a new comment to a page
await commentsManager.addComment('test-project', pageId, 'Alice', 'Great explanation of the architecture!');

// Retrieve all comments for a page
const comments = await commentsManager.getComments('test-project', pageId);

// Mark a comment as resolved
await commentsManager.resolveComment('test-project', 'comment_1', true);

// Get project statistics
const stats = await commentsManager.getStatistics('test-project');
```

## Testing

**Test Coverage**: `tests/unit/comments-manager.test.js`
- 12 test cases across 7 test suites
- Comprehensive coverage of CRUD operations: getComments, addComment, updateComment, deleteComment, resolveComment, and getStatistics
- Tests validate file-based persistence, comment metadata handling, and analytics functionality