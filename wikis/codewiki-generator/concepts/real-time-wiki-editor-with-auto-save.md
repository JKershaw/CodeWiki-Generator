---
title: Real-time wiki editor with auto-save
category: concept
sourceFile: public/wiki-editor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Real-time Wiki Editor with Auto-save

## Purpose and Overview

The real-time wiki editor provides a comprehensive editing experience with live markdown preview, automatic saving, and rich formatting tools. It enables users to edit wiki pages with immediate visual feedback while protecting against data loss through local storage backup and periodic auto-saving.

## Key Functionality

**Live Preview System**
- Converts markdown content to HTML in real-time using the marked.js library
- Updates preview pane automatically as users type via `updatePreview()`
- Provides immediate visual feedback for formatting changes

**Auto-save and Draft Recovery**
- Monitors content changes through `checkForChanges()` to detect unsaved modifications
- Automatically backs up drafts to browser local storage via `autoSaveToLocalStorage()`
- Recovers previous drafts on page load with user confirmation through `loadFromLocalStorage()`
- Implements timestamp-based expiration for draft cleanup

**Rich Text Editing Tools**
- Provides toolbar buttons for common markdown formatting (bold, italic, headers, lists)
- Processes toolbar actions through `handleToolbarAction()` to insert appropriate syntax
- Supports keyboard shortcuts for power users
- Handles text selection and cursor positioning via `insertMarkdown()` and `insertAtLineStart()`

**Server Integration**
- Persists final changes to server through `savePage()` API calls
- Manages both page content and metadata saving
- Provides save status indicators to users

## Relationships

- **Wiki Page System**: Integrates seamlessly with the wiki page viewing workflow for editing existing pages
- **Marked.js Library**: Depends on marked.js for markdown-to-HTML conversion in the preview system
- **Server API**: Connects to backend wiki save endpoints for data persistence
- **HTML Forms**: Works with page metadata form elements for title, tags, and other page properties
- **Browser Storage**: Utilizes localStorage for draft backup and recovery functionality

## Usage Example

```javascript
// Initialize the wiki editor (typically called on page load)
document.addEventListener('DOMContentLoaded', function() {
    // Load any existing draft from local storage
    loadFromLocalStorage();
    
    // Set up auto-save intervals
    setInterval(autoSaveToLocalStorage, 30000); // Save draft every 30 seconds
    
    // Handle toolbar formatting
    document.getElementById('bold-btn').addEventListener('click', function() {
        handleToolbarAction('bold');
    });
    
    // Update preview on content changes
    document.getElementById('content-textarea').addEventListener('input', updatePreview);
});
```

## Testing

No automated tests are currently available for this component. Manual testing should verify auto-save functionality, draft recovery, toolbar actions, and live preview updates.