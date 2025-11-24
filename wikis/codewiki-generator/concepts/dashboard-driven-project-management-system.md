---
title: Dashboard-driven project management system
category: concept
sourceFile: public/projects.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Dashboard-driven project management system

## Purpose and Overview

The dashboard-driven project management system provides a complete client-side interface for managing CodeWiki projects through an interactive web dashboard. It enables users to create, view, configure, and analyze projects with CRUD operations, comparative analytics, and modal-based interactions for streamlined project management workflows.

## Key Functionality

- **Project Dashboard**: Renders project cards in a grid layout displaying project statistics, metadata, and action buttons
- **CRUD Operations**: Create new projects, import existing ones, update settings, and delete projects through modal interfaces
- **Project Comparison**: Side-by-side analysis of selected projects with statistics like page counts, file sizes, and timestamps
- **Interactive Modals**: Consistent modal pattern for all project operations including loading states and form validation
- **Real-time Updates**: Automatic refresh of project data and dashboard state after operations
- **User Feedback**: Notification system for operation success/failure messages

Core functions include:
- `loadProjects()` - Fetches and displays project data from the API
- `renderProjects()` - Creates the dashboard grid layout with project cards
- `updateComparison()` - Populates comparison table with selected project statistics
- `openSettings()` - Manages project configuration through modal forms
- `confirmDelete()` - Handles project deletion with confirmation workflow

## Relationships

- Communicates with backend API endpoints for all project CRUD operations
- Integrates with the existing CodeWiki wiki display system via project navigation links  
- Depends on HTML modal structure and CSS styling defined in the main application
- Works with project statistics and metadata from the broader project management system
- Uses the notification system for user feedback across operations

## Usage Example

```javascript
// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadProjects();
});

// Create new project card and update display
const projectCard = createProjectCard(projectData);
document.getElementById('projects-grid').appendChild(projectCard);

// Update comparison table with selected projects
updateComparison(['project1', 'project2']);

// Display formatted file sizes
const readableSize = formatBytes(1048576); // Returns "1.0 MB"
```

## Testing

No automated tests found for this component. The dashboard functionality relies on manual testing through the web interface to verify project operations, modal interactions, and comparison features work correctly.