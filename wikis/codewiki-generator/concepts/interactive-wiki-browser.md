---
title: Interactive wiki browser
category: concept
sourceFile: public/wiki-browser.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Interactive Wiki Browser

## Purpose and Overview

The Interactive Wiki Browser provides a comprehensive client-side enhancement system for wiki pages, transforming static content into a dynamic, searchable, and navigable experience. It automatically initializes when the DOM loads to add search functionality, table of contents generation, related page discovery, and smooth navigation features to existing wiki pages.

## Key Functionality

**Search and Discovery**
- Real-time search with snippet previews and result highlighting
- Tag-based filtering system for content discovery
- Related page suggestions based on current page content
- Search results display titles, categories, tags, and content snippets

**Navigation Enhancement**
- Automatic table of contents generation from page headings
- Active section highlighting during scroll with intersection observer
- Smooth scrolling behavior for anchor links
- Back-to-top button with scroll position awareness

**Content Processing**
- URL-friendly anchor ID generation from heading text
- HTML escaping for XSS protection in user-generated content
- Client-side TOC creation by scanning existing page structure

**Interactive Features**
- Clickable tags that trigger related content searches
- Dynamic result rendering with proper HTML structure
- Responsive UI elements that adapt to user scroll behavior

## Relationships

The wiki browser integrates deeply with the existing wiki infrastructure:

- **Server Dependencies**: Relies on server-side API endpoints (`/api/search`, `/api/toc`, `/api/related-pages`) for data retrieval
- **Page Integration**: Enhances existing wiki page HTML structure without requiring modifications
- **Context Awareness**: Uses `window.wikiData` object for project and page-specific information
- **Metadata Integration**: Works with wiki page metadata including categories, tags, and content structure

## Usage Example

The wiki browser initializes automatically, but requires proper HTML structure and server endpoints:

```javascript
// Automatic initialization when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    init(); // Called automatically
});

// Manual search trigger (for custom implementations)
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Search results are displayed in #search-results container
// Table of contents appears in #toc-container
// Related pages show in #related-pages section
```

```html
<!-- Required HTML structure -->
<form id="search-form">
    <input type="text" id="search-input" placeholder="Search wiki...">
</form>
<div id="search-results"></div>
<div id="toc-container"></div>
<div id="related-pages"></div>
<button id="back-to-top">↑ Top</button>
```

## Testing

No automated tests found. The component relies on manual testing and browser-based validation of search functionality, navigation behavior, and UI interactions.