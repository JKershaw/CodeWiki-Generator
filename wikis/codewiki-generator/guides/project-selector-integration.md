---
title: Project Selector Integration
category: guide
sourceFile: public/app.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Project Selector Integration

## Purpose and Overview

The Project Selector Integration provides a client-side mechanism for managing multi-project wiki navigation through a dynamic project selection interface. It enables users to switch between different project contexts while maintaining consistent wiki link routing and persisting their selection across browser sessions.

## Key Functionality

- **Dynamic Link Routing**: Automatically updates wiki links based on the currently selected project, allowing the same documentation structure to adapt to different project namespaces without requiring page reloads
- **State Persistence**: Uses localStorage to remember the user's project selection across browser sessions, providing a seamless experience when returning to the wiki
- **DOM Event Handling**: Responds to project selector changes and synchronizes the UI state with the underlying link generation system
- **Cross-Project Navigation**: Maintains consistent navigation patterns while allowing users to view documentation in different project contexts

## Relationships

This integration works closely with:
- **Dynamic Wiki Link Routing**: Provides the project context that determines how wiki links are generated and resolved
- **Client-side Project Persistence**: Handles the storage and retrieval of project selection state
- **Frontend UI Components**: Interfaces with dropdown selectors or other project selection controls in the user interface

## Usage Example

```javascript
// Initialize project selector with stored preference
const savedProject = localStorage.getItem('selectedProject');
const projectSelector = document.getElementById('project-selector');

// Set initial selection from storage
if (savedProject) {
    projectSelector.value = savedProject;
}

// Handle project selection changes
projectSelector.addEventListener('change', function(event) {
    const selectedProject = event.target.value;
    localStorage.setItem('selectedProject', selectedProject);
    // Update all wiki links to use new project context
    updateWikiLinks(selectedProject);
});
```

## Testing

No automated tests are currently available for this component.