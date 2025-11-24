---
title: ActivityFeedManager component
category: component
sourceFile: public/activity-feed.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# ActivityFeedManager Component

## Purpose and Overview

The ActivityFeedManager component provides real-time monitoring of system activities through a client-side interface that connects to a Server-Sent Events (SSE) stream. It manages the complete activity feed lifecycle including connection handling, event filtering, UI interactions, and data persistence for tracking system operations like commits, file analysis, and wiki updates.

## Key Functionality

**Real-time Event Streaming**: Establishes and maintains SSE connections to `/api/activity/feed` endpoint with exponential backoff retry logic for reliable connection management.

**Event Management**: Processes incoming activity events and creates formatted DOM elements with appropriate styling. Maintains event history limits and provides smooth animations for new events.

**Filtering System**: Supports filtering by event types including:
- COMMIT_START
- FILE_ANALYSIS  
- WIKI_UPDATE
- ERROR
- COMPLETION

**Data Operations**: Provides export functionality to save activity history as JSON files and clear operations to reset both client and server-side history.

**Message Formatting**: Converts raw event data into human-readable messages with proper HTML escaping and formatting based on event type.

## Relationships

- **Backend Integration**: Connects to the `/api/activity/feed` SSE endpoint for real-time data streaming
- **Dashboard UI**: Integrates with dashboard components as part of the enhanced monitoring interface
- **Activity Tracking System**: Consumes events from backend services that track various system operations
- **Client-side Persistence**: Manages local activity history and provides export/import capabilities

## Usage Example

```javascript
// Initialize the ActivityFeedManager
const feedManager = new ActivityFeedManager();

// Connect to the real-time feed
feedManager.connectToFeed();

// Set up event filtering
feedManager.setFilter('COMMIT_START');

// Export activity history
feedManager.exportToJSON();

// Clear all history
feedManager.clearHistory();
```

## Testing

No automated tests are currently available for this component. Testing should focus on SSE connection handling, event filtering functionality, and UI interaction behaviors.