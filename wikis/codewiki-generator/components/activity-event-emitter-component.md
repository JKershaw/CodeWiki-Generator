---
title: ActivityEventEmitter component
category: component
sourceFile: lib/activity-event-emitter.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# ActivityEventEmitter Component

## Purpose and Overview

The ActivityEventEmitter is a specialized event management system that provides real-time activity tracking with built-in history management and statistics for dashboard components. It extends Node.js EventEmitter to enable structured monitoring and broadcasting of processing activities across the entire dashboard system, supporting features like live activity feeds and processing status updates.

## Key Functionality

The component manages real-time activity events through a comprehensive set of specialized emission methods:

- **Event Management**: Automatically assigns unique IDs and timestamps to all activity events
- **History Tracking**: Maintains a configurable rolling history of events (default 100 entries)
- **Specialized Emitters**: Provides domain-specific methods for commit processing, file analysis, wiki updates, errors, and completion events
- **Statistics Generation**: Calculates event type distributions and activity counts
- **Real-time Broadcasting**: Leverages EventEmitter pattern for immediate event propagation to listening components

Each emitted event includes standardized metadata (ID, timestamp, type) while supporting custom data payloads specific to different activity types.

## Relationships

- **Extends**: Node.js EventEmitter for standard event handling patterns
- **Integrates with**: Commit processing workflows, file analysis systems, and wiki update operations
- **Supports**: Dashboard real-time activity feed components and monitoring interfaces
- **Provides data to**: Frontend dashboard components requiring live activity status updates

## Usage Example

```javascript
const ActivityEventEmitter = require('./lib/activity-event-emitter');

// Initialize with custom history size
const emitter = new ActivityEventEmitter(10);

// Listen for activity events
emitter.on('activity', (event) => {
  console.log(`Activity: ${event.type} at ${event.timestamp}`);
});

// Emit different types of activities
emitter.emitCommitStart('abc123', 'Fix user authentication');
emitter.emitFileAnalysis('src/auth.js', 'analyzing');
emitter.emitWikiUpdate('Authentication', 'updated');
emitter.emitCompletion({ filesProcessed: 5, duration: 1200 });

// Retrieve event history and statistics
const history = emitter.getHistory(5);
const stats = emitter.getStatistics();
```

## Testing

**Test Coverage**: tests/unit/activity-event-emitter.test.js
- 19 comprehensive test cases across 12 test suites
- Coverage includes constructor initialization, all emission methods, history management, and statistics generation
- Tests verify event timestamps, data structures, and proper EventEmitter integration