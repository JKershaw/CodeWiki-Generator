---
title: Dynamic table of contents with scroll tracking
category: component
sourceFile: public/wiki-browser.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Dynamic Table of Contents with Scroll Tracking

## Purpose and Overview

The dynamic table of contents system automatically generates navigational TOCs from page headings and provides real-time scroll tracking to highlight the currently active section. This component enhances wiki page navigation by creating an interactive sidebar that updates as users scroll through content.

## Key Functionality

**TOC Generation**
- Parses all headings (h1-h6) on the page to build a hierarchical navigation structure
- Generates URL-friendly anchor IDs from heading text using `generateAnchor()`
- Fetches additional server-side TOC data via API to supplement client-side generation
- Creates clickable navigation links with smooth scrolling behavior

**Scroll Tracking**
- Monitors scroll position using the Intersection Observer API
- Automatically highlights the current section in the TOC based on viewport position
- Updates active states in real-time as users navigate through the document
- Provides visual feedback for the user's current location within long documents

**Integration Features**
- Coordinates with the smooth scroll system for seamless navigation
- Works alongside other wiki enhancements like search and related pages
- Maintains TOC state across page interactions and dynamic content updates

## Relationships

The component integrates closely with several other wiki systems:

- **Wiki API**: Fetches server-generated TOC data to complement client-side heading parsing
- **Smooth Scroll Component**: Coordinates with `initSmoothScroll()` for fluid navigation between sections
- **Wiki Page Structure**: Relies on consistent heading hierarchy and CSS classes in rendered wiki content
- **Client-side Enhancement System**: Functions as part of the broader wiki browser enhancement layer
- **Window Context**: Uses `window.wikiData` for project metadata and page context information

## Usage Example

The TOC system initializes automatically as part of the wiki enhancement suite:

```javascript
// TOC is initialized as part of the main wiki browser system
document.addEventListener('DOMContentLoaded', () => {
    init(); // Calls initTableOfContents() internally
});

// Manual TOC generation for dynamic content
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
generateClientSideTOC(headings);
initTOCHighlight(); // Enable scroll tracking
```

## Testing

No automated tests found. The component relies on manual testing with various wiki page structures and heading hierarchies to ensure proper TOC generation and scroll tracking accuracy.