---
title: Multi-service dashboard architecture
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Multi-service dashboard architecture

## Purpose and Overview

The dashboard controller implements a comprehensive service orchestration architecture that integrates 10+ specialized services for wiki management, planning, analytics, and collaboration. It serves as the central coordination layer that manages project-scoped resources and provides real-time activity tracking through Server-Sent Events across all integrated services.

## Key Functionality

The dashboard controller orchestrates multiple specialized services within project contexts:

- **Wiki Services**: WikiContextService for research capabilities, WikiSearchService for full-text search and navigation, and GitHistoryService for version control
- **Collaboration**: CommentsManager for page discussions and real-time activity streaming
- **Planning & Analytics**: PlanningManager for task management, SuggestionEngine for content improvements, and WikiAnalytics for usage insights
- **Project Management**: ProjectManager handles project lifecycle, settings, and metadata
- **Real-time Events**: ActivityEventEmitter provides Server-Sent Events streaming for monitoring system operations and user interactions
- **Content Processing**: Frontmatter parsing for markdown metadata extraction

All services operate within project-scoped contexts, enabling multi-tenant functionality with isolated resources per project.

## Relationships

- Extends the existing WikiManager integration pattern to support multiple specialized services
- Integrates with StateManager for persistent state management across all services
- Builds upon the existing project structure to enable multi-tenant service architecture
- Connects to the Processor component for activity event emission during repository processing operations

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Initialize dashboard with project context
const dashboard = new DashboardController({
  projectId: 'my-wiki-project',
  services: ['wiki', 'planning', 'analytics', 'comments']
});

// Access real-time activity feed
const activityFeed = dashboard.getActivityFeed(projectId);

// Parse frontmatter from markdown content
const metadata = dashboard._parseFrontmatter(markdownContent);
```

## Testing

No automated tests are currently available for this component.