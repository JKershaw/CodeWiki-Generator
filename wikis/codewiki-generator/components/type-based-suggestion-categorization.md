---
title: Type-based suggestion categorization
category: component
sourceFile: public/suggestions.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Type-based Suggestion Categorization

## Purpose and Overview

The type-based suggestion categorization component provides structured classification of documentation issues within the interactive suggestions system. It organizes recommendations into distinct categories (short pages, orphaned pages, broken links, missing tags, missing related pages) with unique visual representations and priority levels to help users prioritize documentation improvements.

## Key Functionality

- **Categorized Issue Detection**: Classifies documentation problems into predefined types with specific icons and labels
- **Visual Representation**: Maps each suggestion type to emoji icons and human-readable labels for easy identification
- **Interactive Card Generation**: Creates DOM elements for each suggestion with type-specific styling and action buttons
- **Statistics Tracking**: Updates dashboard counters showing suggestion counts by type and status
- **Prioritized Display**: Organizes suggestions by category to help users focus on the most critical issues first

The system uses `typeLabels` and `typeIcons` constants to maintain consistent categorization across the interface, while the `createSuggestionCard` function generates interactive elements that display the appropriate visual indicators for each suggestion type.

## Relationships

- **Dashboard Integration**: Updates analytics panels with categorized suggestion statistics
- **Wiki Page Management**: Connects suggestion types to appropriate page modification workflows
- **Project Routing**: Uses consistent URL patterns with other wiki features for type-filtered views
- **UI Components**: Implements collapsible sections matching the dashboard's design patterns

## Usage Example

```javascript
// The categorization system works through predefined type mappings
const typeLabels = {
  'short-page': 'Short Pages',
  'orphaned': 'Orphaned Pages',
  'broken-links': 'Broken Links',
  'missing-tags': 'Missing Tags',
  'missing-related': 'Missing Related Pages'
};

const typeIcons = {
  'short-page': '📄',
  'orphaned': '🔗',
  'broken-links': '❌',
  'missing-tags': '🏷️',
  'missing-related': '🔗'
};

// Suggestions are categorized when creating UI elements
createSuggestionCard(suggestion);
updateStatistics(suggestionsByType);
```

## Testing

No automated tests found for this component.