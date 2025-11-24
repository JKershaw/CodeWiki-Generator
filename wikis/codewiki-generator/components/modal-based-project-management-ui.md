---
title: Modal-based project management UI
category: component
sourceFile: public/projects.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Modal-based Project Management UI

## Purpose and Overview

The Modal-based Project Management UI provides a comprehensive dashboard for managing CodeWiki projects through modal-driven interactions. It implements CRUD operations for projects including creation, import, settings configuration, and deletion workflows, along with a project comparison feature for analyzing multiple projects side-by-side.

## Key Functionality

**Project Dashboard Management**
- Fetches and renders project cards with statistics, repository links, and action buttons
- Handles empty state when no projects exist
- Provides responsive card-based layout for project overview

**Modal-Driven Operations**
- **Create Project**: Opens modal for new project creation with configuration options
- **Import Project**: Provides import workflow for existing codebases
- **Settings**: Populates and manages project configuration through modal forms
- **Delete Confirmation**: Safe deletion with confirmation modal

**Project Comparison**
- Side-by-side comparison dashboard with dropdown selectors
- Statistical analysis and metrics visualization between selected projects
- Dynamic table updates when comparison selection changes

**Async State Management**
- Consistent loading state handling across all operations
- Error handling with user feedback through notifications
- Button state manipulation during async operations

**Utility Functions**
- HTML sanitization for XSS prevention (`escapeHtml`)
- Human-readable file size formatting (`formatBytes`)
- Extensible notification system for user feedback

## Relationships

- **Backend API**: Integrates with REST endpoints for project CRUD operations
- **Wiki Interface**: Connects projects to their respective wiki viewing interfaces
- **Notification System**: Uses shared notification patterns for user feedback
- **Application Design**: Implements consistent modal and responsive design patterns

## Usage Example

```javascript
// Initialize the project dashboard
loadProjects();

// Create a new project card
const projectData = {
  id: 'project-1',
  name: 'My Project',
  description: 'Project description',
  stats: { files: 42, lines: 1500, size: 204800 }
};
const cardHtml = createProjectCard(projectData);

// Open project settings modal
openSettings('project-1');

// Update project comparison
updateComparison();
```

## Testing

No automated tests found for this component.