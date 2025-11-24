---
title: Project comparison and analytics
category: component
sourceFile: public/projects.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Project Comparison and Analytics

## Purpose and Overview

The project comparison and analytics component provides a comprehensive dashboard interface for managing CodeWiki projects with side-by-side comparison capabilities. It enables users to view, create, configure, and analyze multiple projects through an interactive web interface with modal-based interactions and statistical comparisons.

## Key Functionality

This component implements a complete project management dashboard with the following capabilities:

- **Project Dashboard**: Loads and displays project cards in a grid layout with statistics (page counts, file sizes, timestamps)
- **Project Comparison**: Enables selection of multiple projects for side-by-side statistical analysis and comparison
- **CRUD Operations**: Supports creating new projects, importing existing ones, updating settings, and deleting projects through modal dialogs
- **Interactive Modals**: Uses consistent modal patterns for all project operations with loading states and form validation
- **Real-time Updates**: Dynamically updates the comparison table and project cards based on user selections and API responses
- **User Feedback**: Provides notifications for operation success/failure states

The system manages project data client-side through the `projectsData` array and communicates with backend APIs for persistent operations.

## Relationships

- **Backend Integration**: Communicates with REST API endpoints for project CRUD operations and data fetching
- **CodeWiki System**: Integrates with the main wiki display system by generating project-specific links
- **UI Framework**: Depends on predefined HTML modal structures and CSS styling for consistent presentation
- **Project Management**: Works with the broader project metadata and statistics system for analytical features

## Usage Example

```javascript
// Load and display projects on dashboard initialization
loadProjects();

// Create a new project card with statistics
const projectCard = createProjectCard({
  name: "My Project",
  pages: 25,
  totalSize: 1048576,
  lastModified: new Date()
});

// Update comparison table with selected projects
updateComparison(["project1", "project2"]);

// Handle project settings
openSettings("project-id");

// Format file sizes for display
const readableSize = formatBytes(1048576); // "1.0 MB"
```

## Testing

No automated tests found. Manual testing should verify modal interactions, project comparison accuracy, and API integration functionality.