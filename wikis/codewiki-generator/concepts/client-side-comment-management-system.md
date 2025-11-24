---
title: Client-side comment management system
category: concept
sourceFile: public/comments.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Client-side Comment Management System

## Purpose and Overview

The client-side comment management system provides a complete interactive commenting interface for wiki pages. It enables users to add, edit, delete, and resolve comments with real-time UI updates through RESTful API integration.

## Key Functionality

The system implements full CRUD operations for comments with the following capabilities:

- **Comment Display**: Fetches and renders existing comments for the current wiki page
- **Add Comments**: Allows users to submit new comments through a form interface
- **Edit Comments**: Provides inline editing functionality with save/cancel options
- **Delete Comments**: Enables comment removal with user confirmation
- **Resolve Status**: Toggles comment resolved status for tracking discussion completion
- **Security**: Includes HTML escaping to prevent XSS attacks in comment content

The system automatically identifies the current wiki page context using `window.wikiData` to associate comments with specific project and page combinations.

## Relationships

- **Depends on** `window.wikiData` for project and page identification context
- **Integrates with** REST API endpoints (`/api/comments/*`) for all CRUD operations
- **Connects to** wiki page display system through DOM manipulation
- **Uses** browser DOM APIs for dynamic UI updates and form handling

## Usage Example

```javascript
// Initialize the comment system (typically called when page loads)
init();

// The system automatically:
// - Reads project/page context from window.wikiData
// - Loads existing comments via API
// - Sets up event handlers for comment interactions
// - Renders comments to #comments-list container
```

The comment system expects the following DOM structure to be present:
- `#comments-list` container for rendering comments
- Comment form elements for new comment submission
- `window.wikiData.project` and `window.wikiData.page` for page context

## Testing

No automated tests found for this component.