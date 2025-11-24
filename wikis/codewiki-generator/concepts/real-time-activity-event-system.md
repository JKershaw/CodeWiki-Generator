---
title: Real-time activity event system
category: concept
sourceFile: lib/activity-event-emitter.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Real-time Activity Event System

## Purpose and Overview

The Real-time Activity Event System provides centralized event-driven infrastructure for tracking and broadcasting processing activities throughout the codebase analysis pipeline. It standardizes event emission with automatic timestamping, ID generation, and history management to enable real-time dashboard feeds and activity monitoring.

## Key Functionality

The `ActivityEventEmitter` class serves as the central hub for all activity events, extending Node.js EventEmitter with specialized methods for different event types:

- **Event Management**: Automatically adds timestamps, unique IDs, and manages configurable event history
- **Standardized Event Types**: Provides dedicated methods for commit processing, file analysis, wiki updates, errors, and completion events
- **History Tracking**: Maintains a rolling buffer of recent events with configurable size limits
- **Statistics**: Generates analytics data for event patterns and system performance monitoring

Each emitted event includes consistent metadata (timestamp, ID, type) while allowing custom payload data specific to the event context.

## Relationships

- **Dashboard Integration**: Provides the event infrastructure that dashboard components consume for real-time activity feeds
- **Processing Pipeline**: Integrates with existing analysis workflows to emit standardized progress and status events
- **WebSocket Support**: Designed to work with WebSocket or polling-based frontend implementations for live updates

## Usage Example

```javascript
const ActivityEventEmitter = require('./lib/activity-event-emitter');

// Initialize with custom history size
const emitter = new ActivityEventEmitter(50);

// Listen for events
emitter.on('commit_start', (event) => {
  console.log(`Processing commit ${event.commitHash}`);
});

// Emit different types of events
emitter.emitCommitStart({ commitHash: 'abc123', branch: 'main' });
emitter.emitFileAnalysis({ filePath: 'src/utils.js', status: 'analyzing' });
emitter.emitWikiUpdate({ page: 'API Documentation', action: 'created' });

// Retrieve event history for dashboard
const recentEvents = emitter.getHistory(10);
const stats = emitter.getStatistics();
```

## Testing

**Test Coverage**: `tests/unit/activity-event-emitter.test.js`
- 19 test cases across 12 test suites
- Comprehensive coverage including constructor initialization, all event emission methods, history management, and statistics generation
- Tests verify proper event structure, timestamp accuracy, and history size management