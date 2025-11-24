---
title: Client-side comment management
category: component
sourceFile: public/comments.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Client-side Comment Management

## Purpose and Overview

The client-side comment management system provides interactive commenting functionality for wiki pages, enabling users to add, edit, delete, and resolve comments in real-time. It handles all DOM manipulation, state management, and API communication required for wiki page discussions with inline editing capabilities and XSS protection.

## Key Functionality

The comment system provides comprehensive CRUD operations through a set of coordinated functions:

- **Initialization and Loading**: Sets up event listeners and fetches existing comments from the server API
- **Rendering**: Generates interactive comment HTML with edit forms and action buttons for each comment
- **Comment Management**: Handles adding new comments, inline editing with save/cancel options, and deletion with confirmation dialogs
- **Status Control**: Manages comment resolution status toggling via API calls
- **Security**: Prevents XSS attacks by escaping HTML content in user-submitted comments

The system maintains real-time synchronization between the client interface and server state through REST API calls to `/api/comments` endpoints.

## Relationships

This component integrates tightly with the wiki infrastructure:

- **Global Context**: Depends on `window.wikiData` for project and page identification required by API calls
- **API Layer**: Communicates with backend comment endpoints for all CRUD operations and status updates  
- **DOM Integration**: Manipulates existing wiki page HTML structure through specific element IDs for seamless integration
- **Wiki Pages**: Provides discussion functionality as an overlay to existing wiki content without disrupting page structure

## Usage Example

```javascript
// Initialize the comment system on page load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure wikiData is available for API calls
    if (window.wikiData && window.wikiData.projectId && window.wikiData.pageId) {
        init();
    }
});

// The system automatically handles user interactions through event listeners
// Comments are loaded and rendered automatically after initialization
```

## Testing

No automated tests are currently available for this component. Testing should be performed manually by verifying comment CRUD operations, resolve status changes, and XSS protection in a browser environment.