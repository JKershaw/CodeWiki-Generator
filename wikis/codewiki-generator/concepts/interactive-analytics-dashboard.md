---
title: Interactive analytics dashboard
category: concept
sourceFile: public/analytics.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Interactive Analytics Dashboard

## Purpose and Overview

The interactive analytics dashboard provides comprehensive data visualization and reporting capabilities for wiki content analytics. It renders multiple chart types, statistical summaries, and data tables to help users understand page distribution, activity patterns, and content health metrics across wiki projects.

## Key Functionality

The dashboard orchestrates a complete analytics experience through several key components:

**Data Visualization Engine**
- Renders five distinct chart types using Chart.js: category distribution (bar), tag distribution (pie), activity timeline (line), most linked pages (horizontal bar), and longest pages (horizontal bar)
- Maintains consistent theming through a predefined color palette and responsive design
- Manages chart lifecycle including creation, updates, and cleanup to prevent memory leaks

**State Management**
- Coordinates loading, content, and error states across the entire dashboard
- Handles project selection changes by re-fetching data and re-rendering all visualizations
- Maintains global chart instances for efficient updates and cleanup

**Data Export and Tables**
- Generates comprehensive CSV exports containing all analytics dimensions
- Renders specialized tables for orphaned pages (no incoming links) and dead links with source references
- Provides actionable UI elements like view buttons for individual pages

## Relationships

The analytics dashboard integrates deeply with several system components:

- **Analytics API**: Consumes project-specific data endpoints to populate all visualizations and statistics
- **Chart.js Library**: Leverages the visualization library for consistent, interactive chart rendering
- **Project Selection UI**: Responds to project changes by refreshing all dashboard content
- **Wiki Page System**: Links to individual pages through view actions and page references

## Usage Example

```javascript
// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load analytics for default or selected project
    loadAnalytics();
    
    // Set up project selection handler
    const projectSelect = document.getElementById('project-select');
    projectSelect.addEventListener('change', function() {
        loadAnalytics(this.value);
    });
    
    // Set up CSV export
    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', exportToCSV);
});
```

## Testing

No automated tests are currently available for the analytics dashboard. The component relies on manual testing and integration validation with live data sources.