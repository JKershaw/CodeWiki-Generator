---
title: Stateful Processing with Resume Capability
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Stateful Processing with Resume Capability

## Purpose and Overview

This component enables long-running repository analysis operations that can be interrupted and resumed without losing progress. It provides a robust foundation for processing large repositories by maintaining state persistence and allowing recovery from interruptions or failures.

## Key Functionality

The stateful processing system operates through several coordinated mechanisms:

### State Persistence
- Automatically saves processing progress at regular intervals
- Stores commit processing status, analysis results, and metadata
- Maintains cost tracking and processing statistics across sessions

### Resume Detection and Recovery
- Detects existing processing state when starting repository analysis
- Restores previous progress including processed commits and accumulated costs
- Continues processing from the last successfully completed commit

### Progress Tracking
- Tracks which commits have been processed and their analysis status
- Maintains processing metrics including time elapsed and costs incurred
- Provides visibility into overall repository analysis progress

## Relationships

The stateful processing capability integrates with several core components:

- **StateManager**: Handles persistence and retrieval of processing state
- **processRepository**: Main entry point that coordinates stateful processing
- **Processor class**: Extended to support repository-level state management
- **Cost-Aware Processing**: Works together to maintain cost limits across resumed sessions
- **Meta-Analysis Integration**: Preserves meta-analysis context when resuming

## Usage Examples

### Starting Repository Processing
```javascript
// Processing automatically detects and resumes from existing state
await processRepository('owner/repo', {
  maxCost: 100.00,
  outputPath: './analysis'
});
```

### Manual State Management
```javascript
// Check for existing processing state
const existingState = await stateManager.loadState();
if (existingState) {
  console.log(`Resuming from commit ${existingState.lastProcessedCommit}`);
}

// Force clean start (ignoring existing state)
await processRepository('owner/repo', {
  forceRestart: true
});
```

### Monitoring Resume Capability
The system automatically logs resume operations:
```
Found existing processing state for owner/repo
Resuming from commit abc123 (processed 45/120 commits)
Cost accumulated so far: $23.45 of $100.00 limit
```

This capability is essential for processing large repositories where analysis may take hours or days to complete, ensuring that temporary interruptions don't result in lost work or wasted API costs.