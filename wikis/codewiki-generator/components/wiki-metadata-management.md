---
title: Wiki metadata management
category: component
sourceFile: public/wiki-editor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Metadata Management

## Purpose and Overview

The wiki metadata management component handles structured metadata for wiki pages including title, category, and tags. It provides validation, change detection, and form management to ensure consistent page organization across the wiki system.

## Key Functionality

- **Metadata Structure**: Manages three core metadata fields - page title, category classification, and tag assignments
- **Validation**: Validates metadata fields to ensure data integrity and proper formatting
- **Change Detection**: Tracks modifications to metadata fields to determine when pages have unsaved changes
- **Form Integration**: Integrates with the wiki editor's form controls to provide a seamless editing experience
- **State Synchronization**: Coordinates metadata state with the broader editor system including auto-save functionality

The component works alongside content editing features, ensuring that both page content and organizational metadata are properly managed and persisted together.

## Relationships

- **Wiki Editor Integration**: Functions as part of the larger wiki editing system in `wiki-editor.js`
- **Auto-save System**: Metadata changes trigger the auto-save mechanisms and draft recovery features
- **Change Detection**: Integrates with `checkForChanges()` function to update editor status indicators
- **Save Operations**: Metadata is included in `savePage()` API calls to persist complete page information
- **Local Storage**: Metadata state is preserved in browser localStorage for draft recovery

## Usage Example

```javascript
// Metadata is managed through form elements in the wiki editor
// Title field
const titleInput = document.getElementById('page-title');
titleInput.addEventListener('input', checkForChanges);

// Category selection
const categorySelect = document.getElementById('page-category');
categorySelect.addEventListener('change', checkForChanges);

// Tags input
const tagsInput = document.getElementById('page-tags');
tagsInput.addEventListener('input', checkForChanges);

// Metadata is automatically included in save operations
savePage(); // Includes current metadata state
```

## Testing

No automated tests found for this component.