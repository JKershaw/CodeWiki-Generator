---
title: Multi-chart analytics dashboard
category: concept
sourceFile: public/analytics.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-chart Analytics Dashboard

## Purpose and Overview

The multi-chart analytics dashboard provides comprehensive data visualization for wiki analytics, implementing a coordinated system of charts, tables, and export capabilities. It serves as the primary interface for visualizing wiki performance metrics including page categories, tag distributions, activity trends, and content analysis.

## Key Functionality

The dashboard orchestrates multiple visualization components through a centralized rendering system:

- **Chart Visualization Pipeline**: Creates five distinct chart types using Chart.js - bar charts for category distribution, pie charts for tag analysis, line charts for activity tracking, and horizontal bar charts for page metrics
- **Data Export**: Converts analytics data to downloadable CSV format for external analysis
- **Table Rendering**: Displays orphaned pages and dead links in structured tables for content maintenance
- **State Management**: Maintains a global registry of Chart.js instances for proper cleanup and lifecycle management
- **Consistent Styling**: Applies a unified color palette across all visualization components

The system fetches data from the analytics API endpoint and coordinates the rendering of statistics, charts, and tables through the main `renderDashboard` function.

## Relationships

- **API Integration**: Consumes data from `/api/analytics` endpoint for real-time analytics
- **Chart.js Library**: Leverages Chart.js for all data visualization rendering
- **Project Selector**: Coordinates with project filtering components for scoped analytics
- **Dashboard State**: Manages chart instances and component lifecycle across the application

## Usage Example

```javascript
// Initialize and load the analytics dashboard
async function initializeDashboard() {
  await loadAnalytics();
}

// Export current analytics data
function handleExport() {
  exportToCSV();
}

// Load dashboard on page ready
document.addEventListener('DOMContentLoaded', initializeDashboard);
```

## Testing

No automated tests are currently available for this component. Testing coverage should be implemented for chart rendering, data transformation, and export functionality.