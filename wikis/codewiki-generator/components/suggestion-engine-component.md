---
title: SuggestionEngine Component
category: component
sourceFile: lib/suggestion-engine.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# SuggestionEngine Component

## Purpose and Overview

The SuggestionEngine component provides automated analysis of wiki documentation to identify quality issues and generate actionable improvement suggestions. It analyzes wiki content for common problems like short pages, broken links, missing metadata, and orphaned content, then prioritizes suggestions to help maintain high-quality documentation.

## Key Functionality

The SuggestionEngine performs comprehensive wiki quality analysis through several key functions:

- **Content Analysis**: Detects short pages, missing or incomplete metadata, and structural issues
- **Link Validation**: Identifies broken internal links and orphaned pages with no incoming references
- **Suggestion Management**: Generates categorized suggestions with priority levels and tracks their lifecycle (pending, applied, dismissed)
- **Statistics Tracking**: Provides analytics on suggestion patterns, completion rates, and wiki health metrics
- **Persistent Storage**: Stores suggestions as JSON files within project wiki directories for continued tracking

The engine orchestrates these analyses to provide a complete picture of wiki documentation quality and actionable steps for improvement.

## Relationships

- **Depends on WikiManager**: Uses WikiManager for accessing and manipulating wiki content and metadata
- **File System Integration**: Stores suggestion data as JSON files within project wiki directories
- **Dashboard Integration**: Connects with dashboard enhancement features to provide wiki quality management interfaces

## Usage Example

```javascript
const SuggestionEngine = require('./lib/suggestion-engine');

// Initialize the engine with wiki directory path
const engine = new SuggestionEngine('./wikis');

// Generate suggestions for a project
await engine.generateSuggestions('my-project');

// Retrieve existing suggestions
const suggestions = await engine.getSuggestions('my-project');

// Mark a suggestion as applied
await engine.applySuggestion('my-project', 'suggestion-id');

// Get statistics on suggestion status
const stats = await engine.calculateStatistics('my-project');
```

## Testing

**Test Coverage**: `tests/unit/suggestion-engine.test.js`
- 15 test cases across 8 test suites
- Comprehensive coverage of core functionality including suggestion generation, retrieval, status management, orphaned page detection, broken link identification, and statistics calculation
- Tests verify proper integration with WikiManager and correct handling of various wiki content scenarios