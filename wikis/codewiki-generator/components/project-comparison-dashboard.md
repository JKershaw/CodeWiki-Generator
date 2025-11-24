---
title: Project comparison dashboard
category: component
sourceFile: public/projects.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Project Comparison Dashboard

## Purpose and Overview

The project comparison dashboard provides a comprehensive interface for managing CodeWiki projects through modal-based CRUD operations and side-by-side project comparison functionality. It serves as the central hub for project management, allowing users to create, import, configure, and analyze projects with statistical metrics and visualization.

## Key Functionality

### Project Management
- **Project Loading**: Fetches project data from the API and renders project cards with statistics, actions, and repository links
- **Modal-driven Operations**: Implements create, import, settings, and delete workflows through modal interfaces
- **State Management**: Handles loading states, error feedback, and UI updates consistently across all async operations

### Project Comparison
- **Side-by-side Analysis**: Enables comparison of multiple projects with statistical analysis and metrics visualization
- **Dynamic Selection**: Updates comparison tables and dropdowns as project selections change
- **Metrics Display**: Shows formatted project statistics including file sizes, counts, and repository information

### Utility Functions
- **Data Formatting**: Converts raw data (bytes, text) into user-friendly formats
- **Security**: Implements HTML escaping to prevent XSS attacks
- **User Feedback**: Provides notification system for operation results

## Relationships

The dashboard integrates tightly with several system components:

- **Backend API**: Connects to project CRUD endpoints for data operations
- **Wiki Interface**: Links to individual project wiki views through generated URLs  
- **Notification System**: Uses shared user feedback patterns for consistent messaging
- **Modal Components**: Implements application-wide modal design patterns for workflows

## Usage Example

The dashboard is automatically initialized when the page loads and provides interactive project management:

```javascript
// Projects are loaded automatically on page initialization
loadProjects();

// Project comparison updates dynamically when selections change
updateComparison();

// Project cards are rendered with embedded action handlers
const projectCard = createProjectCard(projectData);

// Modal operations are triggered through UI interactions
openSettings(projectId);
confirmDelete(projectId);
```

## Testing

No automated tests are currently available for this component. Testing should focus on modal workflows, project comparison functionality, and API integration patterns.