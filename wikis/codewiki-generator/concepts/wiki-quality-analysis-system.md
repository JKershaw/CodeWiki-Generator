---
title: Wiki Quality Analysis System
category: concept
sourceFile: lib/suggestion-engine.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Quality Analysis System

## Purpose and Overview

The Wiki Quality Analysis System automatically analyzes wiki documentation to identify quality issues and generate actionable improvement suggestions. It detects problems like short pages, broken links, missing metadata, and orphaned content, providing prioritized recommendations to maintain high-quality documentation standards.

## Key Functionality

The system centers around the **SuggestionEngine** component, which orchestrates the entire analysis workflow:

- **Automated Analysis**: Scans all pages in a project wiki to identify various quality issues
- **Suggestion Generation**: Creates categorized improvement suggestions with priority levels
- **Lifecycle Management**: Tracks suggestion status (pending, applied, dismissed) with persistent storage
- **Quality Metrics**: Identifies orphaned pages with no incoming links and detects broken internal links
- **Statistics Tracking**: Computes analytics on suggestions by status, type, and priority
- **Persistent Storage**: Saves suggestions as JSON files within project wiki directories

The engine analyzes multiple quality dimensions including content length, metadata completeness, link integrity, and page connectivity within the wiki structure.

## Relationships

- **Depends on WikiManager**: Uses WikiManager for accessing and manipulating wiki content during analysis
- **File System Integration**: Stores suggestion data as JSON files within project wiki directories for persistence
- **Dashboard Integration**: Connects with dashboard enhancement features to provide wiki quality management interfaces

## Usage Example

```javascript
const SuggestionEngine = require('./lib/suggestion-engine');

// Initialize the engine with wikis directory
const engine = new SuggestionEngine('./wikis');

// Generate suggestions for a project
await engine.generateSuggestions('my-project');

// Retrieve existing suggestions
const suggestions = await engine.getSuggestions('my-project');

// Apply or dismiss suggestions
await engine.applySuggestion('my-project', 'suggestion-id');
await engine.dismissSuggestion('my-project', 'suggestion-id');

// Get quality statistics
const stats = await engine.calculateStatistics('my-project');
```

## Testing

**Test Coverage**: Comprehensive test suite in `tests/unit/suggestion-engine.test.js`
- **15 test cases** across **8 test suites**
- **Test Categories**: SuggestionEngine initialization, generateSuggestions, getSuggestions, applySuggestion, dismissSuggestion, findOrphanedPages, findBrokenLinks, calculateStatistics
- Tests cover suggestion detection, lifecycle management, link analysis, and statistics computation