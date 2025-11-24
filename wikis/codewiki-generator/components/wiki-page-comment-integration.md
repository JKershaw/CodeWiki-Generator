---
title: Wiki page comment integration
category: component
sourceFile: public/comments.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Page Comment Integration

## Purpose and Overview

The Wiki page comment integration provides a complete client-side commenting system for wiki pages. It enables users to add, edit, delete, and resolve comments associated with specific wiki pages, with real-time UI updates and XSS protection.

## Key Functionality

The comment system provides comprehensive CRUD operations through a clean JavaScript interface:

- **Comment Management**: Full create, read, update, and delete operations for comments
- **Resolved Status Tracking**: Toggle comments between active and resolved states
- **Inline Editing**: Edit comments directly in the UI without page refreshes
- **Security**: HTML escaping to prevent XSS attacks
- **Context Awareness**: Automatically associates comments with specific projects and pages using `window.wikiData`

The system fetches comments via REST API endpoints and dynamically renders them with interactive controls. All operations provide immediate visual feedback and update the UI without requiring page reloads.

## Relationships

- **Depends on**: `window.wikiData` object for project and page context information
- **Integrates with**: REST API backend providing comment CRUD endpoints (`/api/comments/*`)
- **Connects to**: Wiki page display system through DOM manipulation
- **Uses**: Standard DOM APIs for dynamic UI updates and event handling

## Usage Example

```javascript
// Initialize the comment system on a wiki page
// Requires window.wikiData to be set with project and page info
window.wikiData = {
    projectId: 'my-project',
    pageId: 'page-123'
};

// Initialize the comment system
init();

// The system automatically:
// - Loads existing comments from the API
// - Renders them in the comments container
// - Sets up event handlers for all comment actions
```

The comment system expects specific DOM elements to be present:
- A comments list container for rendering comments
- An add comment form for new comment submission
- The `window.wikiData` object containing `projectId` and `pageId`

## Testing

No automated tests found for this component.