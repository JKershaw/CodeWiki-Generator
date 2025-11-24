---
title: Local storage draft recovery system
category: component
sourceFile: public/wiki-editor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Local Storage Draft Recovery System

## Purpose and Overview

The local storage draft recovery system provides automatic backup and recovery of unsaved wiki editor work using browser local storage. It prevents data loss by continuously saving drafts with timestamp-based expiration and offers user-controlled recovery when returning to the editor.

## Key Functionality

The system operates through several key mechanisms:

- **Automatic Draft Saving**: The `autoSaveToLocalStorage` function continuously backs up the current editor state, including content and metadata, to browser storage
- **Draft Recovery**: The `loadFromLocalStorage` function detects previously saved drafts and prompts users to restore unsaved work when they return to the editor
- **Timestamp Management**: Implements expiration logic to prevent stale drafts from cluttering storage
- **User Confirmation**: Provides user control over draft restoration rather than automatically overwriting current content
- **Storage Cleanup**: Manages local storage space by removing expired or restored drafts

The system integrates seamlessly with the broader wiki editor functionality, triggering saves during content changes and offering recovery during editor initialization.

## Relationships

The draft recovery system connects to several other components:

- **Wiki Editor Core**: Integrates with the main editor's change detection and initialization lifecycle
- **Auto-save System**: Works alongside server-side auto-save to provide local redundancy
- **Content Management**: Coordinates with `checkForChanges` to determine when drafts need updating
- **Browser Storage API**: Utilizes localStorage for persistent draft storage across browser sessions
- **User Interface**: Provides confirmation dialogs and notifications for draft recovery workflows

## Usage Example

```javascript
// Auto-save draft when content changes
function handleContentChange() {
    autoSaveToLocalStorage();
}

// Check for existing drafts on editor load
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage(); // Prompts user if drafts exist
});

// Manual draft recovery
const draftData = loadFromLocalStorage();
if (draftData) {
    // User confirms restoration via dialog
    editor.setValue(draftData.content);
}
```

## Testing

No automated tests found for this component. Manual testing should verify draft saving during content changes, recovery prompts on page load, and proper cleanup of expired drafts.