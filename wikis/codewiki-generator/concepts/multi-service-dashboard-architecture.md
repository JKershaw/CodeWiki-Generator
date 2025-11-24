---
title: Multi-service dashboard architecture
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-service Dashboard Architecture

## Purpose and Overview

The dashboard controller implements a comprehensive service-oriented architecture that coordinates 10 specialized services for wiki management, real-time collaboration, and project lifecycle management. It serves as the central orchestrator for features including real-time activity tracking, collaborative editing, project planning, analytics, and git-based version control.

## Key Functionality

**Service Coordination**: Manages WikiContextService, WikiSearchService, ActivityEventEmitter, PlanningManager, SuggestionEngine, WikiAnalytics, ProjectManager, CommentsManager, and GitHistoryService through a unified controller interface.

**Real-time Activity Tracking**: Implements Server-Sent Events (SSE) for live activity monitoring with automatic keepalive mechanisms and proper connection cleanup. The system emits events for wiki changes, user actions, and system activities.

**Collaborative Features**: Provides comprehensive team collaboration tools including:
- Comments system with author tracking and content management
- Intelligent content suggestions based on wiki analysis
- Project planning with task lifecycle management (create, update, delete)
- Real-time activity feeds for team awareness

**Content Management**: Handles wiki search with full-text indexing, table of contents generation, and YAML frontmatter parsing for metadata extraction and validation.

**Analytics and History**: Delivers usage analytics dashboards and integrates git history tracking for comprehensive wiki versioning and change analysis.

## Relationships

- **Extends WikiManager**: Builds upon existing wiki functionality while maintaining backward compatibility
- **Event-driven Architecture**: Integrates with ActivityEventEmitter for real-time monitoring and notification systems
- **Service Integration**: Coordinates multiple specialized service classes through RESTful API patterns
- **Data Layer**: Works with existing wiki storage while adding collaborative metadata and project management data

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Initialize dashboard with services
const dashboard = new DashboardController(wikiManager, options);

// Set up real-time activity feed
app.get('/api/activity-feed', dashboard.getActivityFeed);

// Search wiki content
const searchResults = await dashboard.searchWiki('query string');

// Add collaborative comment
const comment = await dashboard.addComment({
  pageId: 'page-name',
  content: 'Comment text',
  author: 'username'
});

// Generate content suggestions
const suggestions = await dashboard.generateSuggestions('page-context');
```

## Testing

No automated tests are currently available for this component. Testing coverage should be implemented to verify service coordination, real-time event handling, and collaborative feature functionality.