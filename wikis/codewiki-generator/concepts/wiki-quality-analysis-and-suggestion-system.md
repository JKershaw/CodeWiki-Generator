---
title: Wiki quality analysis and suggestion system
category: concept
sourceFile: lib/suggestion-engine.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Quality Analysis and Suggestion System

## Purpose and Overview

The SuggestionEngine analyzes wiki documentation quality and generates actionable improvement recommendations. It implements automated quality assessment with configurable rule-based analysis, tracking suggestions for short pages, missing metadata, orphaned content, and broken links.

## Key Functionality

The system provides comprehensive wiki quality analysis through several core features:

- **Quality Analysis**: Detects short pages (under 100 words), missing metadata, orphaned pages with no incoming links, and broken internal links
- **Suggestion Management**: Creates structured suggestions with priority levels, types, and actionable descriptions
- **Status Tracking**: Manages suggestion lifecycle with applied/dismissed states and timestamps  
- **Metrics Generation**: Calculates statistics grouped by status, type, and priority for dashboard insights
- **Persistent Storage**: Saves suggestions as JSON files within project wiki directories

The engine uses configurable thresholds and rule-based analysis to maintain documentation standards across wiki projects.

## Relationships

- **Integrates with WikiManager**: Accesses wiki pages for content analysis and link validation
- **File System Integration**: Stores suggestions as JSON files within project wiki directories
- **Dashboard Enhancement**: Provides structured data for quality metrics and improvement tracking

## Usage Example

```javascript
const SuggestionEngine = require('./lib/suggestion-engine');

// Initialize the engine
const engine = new SuggestionEngine('./wikis');

// Generate suggestions for a project
await engine.generateSuggestions('project-name');

// Retrieve suggestions with statistics
const { suggestions, statistics } = await engine.getSuggestions('project-name');

// Manage suggestion lifecycle
await engine.applySuggestion('project-name', 'suggestion-id');
await engine.dismissSuggestion('project-name', 'suggestion-id');
```

## Testing

**Test Coverage**: `tests/unit/suggestion-engine.test.js`
- 15 test cases across 8 test suites
- Comprehensive testing of core functionality: generateSuggestions, getSuggestions, applySuggestion, dismissSuggestion, findOrphanedPages, findBrokenLinks, and calculateStatistics
- Validates quality detection rules, suggestion management workflow, and statistics generation