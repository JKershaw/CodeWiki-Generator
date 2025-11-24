---
title: Activity-driven event system
category: concept
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Activity-driven Event System

## Purpose and Overview

The activity-driven event system provides real-time monitoring and tracking of operations across the wiki platform through Server-Sent Events (SSE). It enables live updates of user interactions, system operations, and content changes to keep dashboard interfaces synchronized with backend activity.

## Key Functionality

The system centers around the `ActivityEventEmitter` module which manages event emission and history tracking. Key capabilities include:

- **Real-time Event Streaming**: Uses Server-Sent Events to push activity updates to connected clients in real-time
- **Activity History**: Maintains a persistent record of all system activities for audit trails and replay functionality
- **Event Processing Integration**: Automatically captures events during repository processing and other system operations
- **Multi-service Activity Tracking**: Monitors activities across all integrated services including wiki operations, planning tasks, analytics, and collaborative features

The `getActivityFeed` function serves as the SSE endpoint, establishing persistent connections with clients to stream activity data as it occurs throughout the platform.

## Relationships

- **Integrates with Processor**: Receives activity events during repository processing operations
- **Connects to StateManager**: Persists activity history and maintains event state across sessions  
- **Works with Multi-service Architecture**: Tracks activities from WikiManager, PlanningManager, SuggestionEngine, WikiAnalytics, and other dashboard services
- **Supports Project-scoped Operations**: Activity tracking respects project boundaries for multi-tenant functionality

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Initialize dashboard controller with project context
const dashboard = new DashboardController(projectId);

// Set up SSE endpoint for real-time activity feed
app.get('/activity-feed', (req, res) => {
  dashboard.getActivityFeed(req, res);
});

// Activity events are automatically emitted during operations
// Clients connect to /activity-feed to receive real-time updates
```

## Testing

No automated tests found for this component. Testing should focus on SSE connection handling, event emission accuracy, and activity history persistence.