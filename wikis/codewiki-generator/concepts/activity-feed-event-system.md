---
title: Activity feed event system
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Activity Feed Event System

## Purpose and Overview

The Activity feed event system provides real-time event emission capabilities for tracking processing activities across the commit processing workflow. This system enables external components to monitor and respond to various stages of the commit processing pipeline, supporting dashboard enhancements and real-time activity monitoring.

## Key Functionality

The activity feed event system works as an optional dependency within the Processor class:

- **Real-time Event Emission**: Emits events during key stages of commit processing to provide visibility into the workflow
- **Optional Integration**: Functions as an optional dependency through the `activityEmitter` interface, allowing the processor to operate with or without activity tracking
- **Processing Activity Tracking**: Monitors and broadcasts activities throughout the commit processing lifecycle
- **Dashboard Integration**: Connects processing events to dashboard components for live status updates

The system integrates seamlessly into the existing processor workflow without disrupting core functionality when the activity emitter is not present.

## Relationships

- **Integrates with commit processing workflow**: Embeds event emissions within the standard commit processing pipeline
- **Connects to dashboard enhancement features**: Provides the event stream needed for real-time dashboard updates
- **Extends existing Processor class functionality**: Adds activity tracking capabilities to the core processor without modifying its primary responsibilities

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize processor with activity emitter
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  activityEmitter: activityEmitter // Optional dependency
});

// Process commits - events will be emitted automatically
await processor.processCommit(commitData);
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive testing of Processor functionality including processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository methods
- Tests validate both core processing functionality and integration points for the activity feed system