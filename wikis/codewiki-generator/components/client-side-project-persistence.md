---
title: Client-side Project Persistence
category: component
sourceFile: public/app.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Client-side Project Persistence

## Purpose and Overview

The Client-side Project Persistence component uses browser localStorage to maintain user project selections across browser sessions. This provides a seamless user experience by automatically restoring the previously selected project when users return to the application.

## Key Functionality

- **Persistent State Management**: Stores the user's current project selection in localStorage, ensuring the choice survives browser refreshes and new sessions
- **Automatic Restoration**: Retrieves and applies the saved project selection when the application loads
- **Session Continuity**: Eliminates the need for users to repeatedly select their preferred project context

The component works by intercepting project selection events and immediately persisting the choice to localStorage. On subsequent page loads, it checks for existing project data and automatically restores the user's previous selection.

## Relationships

This component integrates closely with:

- **Dynamic Wiki Link Routing**: Provides the project context that wiki links use to route to the correct project namespace
- **Project Selector Integration**: Responds to user selection events from the frontend project selector UI to persist choices
- **DOM State Management**: Synchronizes persisted project data with the current UI state to maintain consistency

The persistence layer acts as the bridge between user interactions and the routing system, ensuring that project context remains consistent across all wiki navigation.

## Usage Example

```javascript
// Project selection is automatically persisted when user makes a selection
const projectSelector = document.getElementById('project-selector');
projectSelector.addEventListener('change', function(event) {
    const selectedProject = event.target.value;
    localStorage.setItem('selectedProject', selectedProject);
});

// On page load, restore the previously selected project
const savedProject = localStorage.getItem('selectedProject');
if (savedProject) {
    projectSelector.value = savedProject;
}
```

## Testing

No automated tests found for this component.