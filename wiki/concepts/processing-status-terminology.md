---
title: Processing status terminology
category: concept
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Processing Status Terminology

## Purpose and Overview

Processing status terminology defines the standardized lifecycle states for processor components throughout the system. This concept establishes clear, precise terminology to distinguish between different phases of operation, improving monitoring accuracy and debugging clarity.

## Key Functionality

The status terminology system provides four distinct states that processors transition through:

- **`running`** - Processor is actively executing tasks and processing data
- **`processing`** - Processor is engaged in computational work but may be between discrete operations
- **`stopped`** - Processor has been intentionally halted and is no longer accepting new work
- **`completed`** - Processor has finished all assigned tasks and reached a natural endpoint

### State Transitions

Processors typically follow these transition patterns:

```
idle → running → processing → completed
  ↓      ↓           ↓
stopped ← stopped ← stopped
```

The terminology distinguishes between:
- **Active states** (`running`, `processing`) - System is operational
- **Terminal states** (`stopped`, `completed`) - System has ceased operation
- **Intentional vs Natural endings** (`stopped` vs `completed`)

## Relationships

Processing status terminology integrates with several system components:

- **StateManager** - Persists status changes and maintains processor state history
- **Monitoring systems** - Use status values for health checks and alerts  
- **Process coordination** - Status determines whether processors can accept new tasks
- **Error handling** - Status transitions help identify failure points in processing pipelines

## Usage Examples

### Status Checking
```javascript
if (processor.status === 'running') {
  // Safe to queue additional work
} else if (processor.status === 'completed') {
  // Processor finished successfully
}
```

### Monitoring Integration
```javascript
// Clear status reporting for operations teams
const statusMessage = {
  'running': 'Active processing in progress',
  'processing': 'Computing results',
  'stopped': 'Manually halted',
  'completed': 'All tasks finished successfully'
}[processor.status];
```

The standardized terminology eliminates ambiguity in system monitoring and ensures consistent behavior across different processor implementations.