---
title: Real-time wiki commenting system
category: concept
sourceFile: public/comments.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Real-time Wiki Commenting System

## Purpose and Overview

The real-time wiki commenting system provides interactive commenting functionality for wiki pages, enabling users to discuss content directly on each page. This client-side system handles all comment operations including creation, editing, deletion, and resolution status tracking with seamless DOM integration.

## Key Functionality

- **Comment CRUD Operations**: Complete create, read, update, and delete functionality for wiki page comments
- **Inline Editing**: Users can edit comments directly in the interface without page refreshes
- **Resolution Tracking**: Comments can be marked as resolved/unresolved for discussion management
- **Real-time Updates**: All operations update the display immediately after successful API calls
- **Security**: HTML content is escaped to prevent XSS attacks
- **Interactive Controls**: Each comment displays with edit, delete, and resolve toggle buttons

The system works by initializing event listeners on page load, fetching existing comments from the server API, and rendering them with interactive controls. All user actions trigger API calls to `/api/comments` endpoints and update the DOM accordingly.

## Relationships

- **Wiki Data Integration**: Depends on `window.wikiData` for project and page identification context
- **REST API**: Communicates with backend `/api/comments` endpoints for all data operations
- **DOM Integration**: Integrates with existing wiki page HTML structure through specific element IDs
- **Page Context**: Operates within the scope of individual wiki pages, loading comments specific to each page

## Usage Example

```javascript
// Initialize the commenting system on a wiki page
// Requires window.wikiData to be set with project and page info
window.wikiData = {
  project: 'my-project',
  page: 'documentation-page'
};

// Initialize the comment system (typically called on page load)
init();

// The system will automatically:
// - Load existing comments for the current page
// - Set up event listeners for comment interactions
// - Render comments with edit, delete, and resolve controls
```

## Testing

No automated tests are currently available for this component. Manual testing should verify comment creation, editing, deletion, and resolution toggle functionality across different wiki pages.