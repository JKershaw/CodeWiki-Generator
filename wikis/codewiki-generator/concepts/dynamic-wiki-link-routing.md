---
title: Dynamic Wiki Link Routing
category: concept
sourceFile: public/app.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Dynamic Wiki Link Routing

## Purpose and Overview

Dynamic Wiki Link Routing implements a client-side system that automatically adapts wiki links based on the user's currently selected project context. This enables a multi-project wiki interface where users can switch between project namespaces and have all documentation links update dynamically without requiring page reloads.

## Key Functionality

- **Context-Aware Link Generation**: Automatically updates wiki links throughout the page when users switch project contexts, ensuring all navigation remains within the selected project namespace
- **Persistent Project State**: Leverages localStorage to maintain user's project selection across browser sessions, providing continuity in their documentation browsing experience
- **Real-time UI Synchronization**: Responds to project selector changes by immediately updating all relevant links in the DOM, maintaining consistency between user selection and available navigation paths

## Relationships

- **Project Selector Component**: Integrates with frontend project selection controls, listening for change events to trigger link updates
- **Wiki Navigation System**: Works alongside the broader wiki routing infrastructure to ensure seamless navigation within project contexts
- **Browser Storage API**: Utilizes localStorage for state persistence, enabling stateful behavior across page reloads and sessions
- **DOM Management**: Coordinates with page rendering to dynamically update link attributes based on current project context

## Usage Example

```javascript
// Initialize project selector and bind to change events
const projectSelector = document.getElementById('project-selector');
const currentProject = localStorage.getItem('selectedProject') || 'default';

// Set initial project state
projectSelector.value = currentProject;
updateWikiLinks(currentProject);

// Handle project changes
projectSelector.addEventListener('change', function(event) {
    const selectedProject = event.target.value;
    localStorage.setItem('selectedProject', selectedProject);
    updateWikiLinks(selectedProject);
});
```

## Testing

No automated tests found. Manual testing should verify project persistence across browser sessions and correct link updates when switching project contexts.