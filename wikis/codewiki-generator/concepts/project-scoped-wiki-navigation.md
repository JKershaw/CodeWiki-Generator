---
title: Project-scoped Wiki Navigation
category: concept
sourceFile: public/app.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Project-scoped Wiki Navigation

## Purpose and Overview

The Project-scoped Wiki Navigation system enables dynamic URL routing where wiki links are automatically updated based on the user's selected project. This functionality provides multi-project support with persistent state management, allowing users to seamlessly navigate between different project wikis while maintaining their project context.

## Key Functionality

The system implements a dynamic link updating mechanism through the `updateWikiLinks` function that:

- Monitors project selection changes through HTML project selector elements
- Automatically parses and modifies `href` attributes of elements with the `wiki-link` CSS class
- Updates URLs to follow the `/wiki/PROJECT/page` pattern based on the currently selected project
- Maintains project selection state using localStorage for persistence across browser sessions
- Integrates seamlessly with the existing DOMContentLoaded event handling system

When a user switches projects, all wiki navigation links on the page are instantly updated to point to the corresponding pages within the newly selected project's wiki namespace.

## Relationships

This component integrates with several existing system patterns:

- **Event Handling**: Extends the established DOMContentLoaded event handling pattern in the application
- **State Management**: Leverages the existing localStorage usage pattern for maintaining user preferences
- **HTML Integration**: Works directly with HTML project selector elements and any links marked with the `wiki-link` CSS class
- **URL Structure**: Enforces consistent wiki URL patterns across the multi-project environment

## Usage Example

```javascript
// Ensure wiki links are marked with the appropriate CSS class
// <a href="/wiki/default/HomePage" class="wiki-link">Home</a>

// The system automatically updates links when project selection changes
// Project selector HTML element triggers the updateWikiLinks function
// Links are dynamically updated from /wiki/old-project/page to /wiki/new-project/page
```

To implement this system, ensure your HTML contains:
- A project selector element that triggers project changes
- Wiki links marked with the `wiki-link` CSS class
- URLs following the `/wiki/PROJECT/page` structure

## Testing

No automated tests are currently available for this component. Manual testing should verify that wiki links update correctly when switching between projects and that project selection persists across browser sessions.