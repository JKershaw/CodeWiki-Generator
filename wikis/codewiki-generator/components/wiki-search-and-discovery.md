---
title: Wiki search and discovery
category: component
sourceFile: public/wiki-browser.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Search and Discovery

## Purpose and Overview

The Wiki Search and Discovery component provides a comprehensive client-side browsing experience for wiki pages, enhancing static content with dynamic search, navigation, and content discovery features. It transforms basic wiki pages into an interactive platform with real-time search capabilities, automatic table of contents generation, and intelligent content recommendations.

## Key Functionality

**Search and Discovery**
- Real-time search with snippet previews and result highlighting
- Tag-based filtering for content discovery
- Related page suggestions based on current page content
- Search result display with titles, categories, and content excerpts

**Navigation Enhancement**
- Automatic table of contents generation from page headings
- Active section highlighting during scroll
- Smooth scrolling behavior for anchor links
- Back-to-top button with scroll-based visibility

**Content Organization**
- Client-side TOC creation by scanning page headings
- URL-friendly anchor ID generation for headings
- Tag filtering system for exploring related content
- XSS protection through HTML content escaping

## Relationships

The component integrates deeply with the existing wiki infrastructure:
- **Server Dependencies**: Relies on server-side wiki API endpoints for search results, TOC data, and related page recommendations
- **Page Integration**: Enhances existing wiki page structure and metadata without requiring changes to static content
- **Context Awareness**: Uses `window.wikiData` to access project and page context for personalized features
- **Progressive Enhancement**: Adds dynamic functionality to static wiki pages while maintaining accessibility

## Usage Example

```javascript
// Initialize wiki browser features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // The browser automatically initializes all features
    init();
    
    // Individual components can be initialized separately if needed
    initSearch();
    initTableOfContents();
    initRelatedPages();
    initTagFiltering();
});

// Example of programmatic search result display
displaySearchResults([
    {
        title: "Getting Started",
        category: "Documentation", 
        tags: ["setup", "tutorial"],
        snippet: "Learn how to get started with the platform..."
    }
]);
```

## Testing

No automated tests are currently available for this component. Manual testing should verify search functionality, TOC generation accuracy, smooth scrolling behavior, and proper integration with server-side APIs across different wiki page structures.