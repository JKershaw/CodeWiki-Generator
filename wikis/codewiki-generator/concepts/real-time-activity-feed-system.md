---
title: Real-time activity feed system
category: concept
sourceFile: public/activity-feed.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Real-time Activity Feed System

## Purpose and Overview

The real-time activity feed system provides live monitoring and display of processing activities through Server-Sent Events (SSE). It offers resilient connection management with automatic reconnection, event filtering, and data persistence capabilities for tracking commits, file analysis, wiki updates, errors, and completion events.

## Key Functionality

**Real-time Event Streaming**
- Establishes SSE connections to `/api/activity/feed` endpoint
- Implements exponential backoff reconnection strategy for connection failures
- Automatically reconnects when browser tab becomes visible after being hidden

**Activity Event Processing**
- Processes multiple event types: commits, file analysis, wiki updates, errors, and completions
- Formats events into human-readable messages with type-specific styling and icons
- Creates dynamic DOM elements for real-time feed display

**Feed Management**
- Filters events by type for focused monitoring
- Exports activity history as downloadable JSON files
- Clears activity history with server synchronization and user confirmation

**Connection Resilience**
- Tracks connection status and displays appropriate indicators
- Handles network interruptions with automatic recovery
- Manages visibility-based connection lifecycle

## Relationships

- **Server Integration**: Connects to `/api/activity/feed` for real-time updates and `/api/activity/history` for data export
- **Data Management**: Communicates with `/api/activity/clear` for history management operations
- **Dashboard System**: Functions as part of the dashboard enhancement features for system monitoring
- **Activity Tracking**: Complements server-side activity tracking infrastructure

## Usage Example

```javascript
// Initialize the activity feed manager
const feedManager = new ActivityFeedManager();

// Set up event filtering for specific activity types
feedManager.setFilter('commit'); // Show only commit events
feedManager.setFilter('error');  // Show only error events
feedManager.setFilter('all');    // Show all event types

// Export activity history
feedManager.exportToJSON();

// Clear activity history with confirmation
feedManager.clearHistory();
```

## Testing

No automated tests found for this component. Testing should focus on SSE connection handling, event processing accuracy, and UI interaction behaviors.