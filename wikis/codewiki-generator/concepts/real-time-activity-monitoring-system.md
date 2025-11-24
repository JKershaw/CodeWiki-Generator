---
title: Real-time activity monitoring system
category: concept
sourceFile: public/activity-feed.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# ActivityFeedManager

## Purpose and Overview

The ActivityFeedManager is a client-side component that provides real-time activity monitoring through a web-based dashboard interface. It establishes Server-Sent Events connections to display live system activities, manages event filtering and persistence, and offers user controls for monitoring application workflows.

## Key Functionality

- **Real-time Event Streaming**: Connects to backend `/api/activity/feed` SSE endpoint with automatic reconnection and exponential backoff retry logic
- **Event Display Management**: Creates animated DOM elements for activity events with proper styling and maintains configurable event history limits
- **Interactive Filtering**: Filters events by type including COMMIT_START, FILE_ANALYSIS, WIKI_UPDATE, ERROR, and COMPLETION categories
- **Data Persistence**: Exports activity history to JSON files for analysis and provides server-side history clearing capabilities
- **Connection Management**: Handles SSE connection lifecycle with proper cleanup, reconnection strategies, and connection status tracking
- **Message Formatting**: Converts different event types into human-readable messages with HTML escaping for safe display

The system automatically manages DOM updates with smooth animations, maintains connection stability through retry mechanisms, and provides comprehensive user controls for activity monitoring.

## Relationships

- Connects to backend ActivityEventEmitter through `/api/activity/feed` SSE endpoint for real-time event streaming
- Integrates with dashboard UI components as part of the enhanced monitoring interface
- Uses activity tracking system from backend services to receive structured event data
- Complements server-side ActivityEventEmitter by providing the client-side visualization and interaction layer
- Part of the comprehensive dashboard enhancement system for real-time application monitoring

## Usage Example

```javascript
// Initialize activity feed manager
const feedManager = new ActivityFeedManager();

// Set up event filtering
feedManager.setFilter('COMMIT_START');

// Export activity history
feedManager.exportToJSON();

// Clear all history
feedManager.clearHistory();
```

## Testing

**Test Coverage**: No automated tests found. The component would benefit from integration tests covering SSE connection handling, event filtering, DOM manipulation, and retry logic functionality.