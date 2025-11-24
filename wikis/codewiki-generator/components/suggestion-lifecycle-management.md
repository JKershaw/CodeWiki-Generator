---
title: Suggestion lifecycle management
category: component
sourceFile: public/suggestions.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Suggestion Lifecycle Management

## Purpose and Overview

The suggestion lifecycle management component handles the complete workflow of AI-powered documentation improvement suggestions, from generation through resolution. It manages suggestion states, user interactions, and provides a dashboard interface for reviewing and applying automated documentation improvements.

## Key Functionality

This component orchestrates several key operations:

- **Suggestion Generation**: Triggers AI analysis of documentation projects to identify improvement opportunities like short pages, broken links, orphaned content, and missing relationships
- **Lifecycle Management**: Tracks suggestions through their complete workflow - from initial generation, through filtering and presentation, to final resolution via apply or dismiss actions
- **Interactive Dashboard**: Renders suggestion cards with type-specific icons, priority badges, and action buttons for user interaction
- **Statistics Tracking**: Maintains real-time counts of suggestions by type and status for dashboard analytics
- **Automated Application**: Applies AI-generated suggestions directly to project documentation with user confirmation

The system supports multiple suggestion types with different priorities and automatically updates project content when suggestions are applied.

## Relationships

- **Dashboard Integration**: Connects with dashboard analytics system to display suggestion statistics and metrics
- **Content Management**: Integrates with wiki content management system to apply suggestions directly to documentation
- **Project Management**: Works with project selector component to manage suggestions across multiple documentation projects  
- **API Layer**: Implements CRUD operations through dedicated API endpoints for suggestion persistence and retrieval

## Usage Example

```javascript
// Load and display suggestions for current project
await loadSuggestions();

// Generate new AI-powered suggestions
await handleGenerateSuggestions();

// Apply a suggestion to update documentation
await handleApplySuggestion(suggestionId);

// Dismiss a suggestion from active list
await handleDismissSuggestion(suggestionId);

// Update dashboard statistics
updateStatistics(suggestions);
```

## Testing

No automated tests are currently available for this component. Testing should focus on suggestion generation accuracy, state management during the apply/dismiss workflow, and proper integration with the dashboard analytics system.