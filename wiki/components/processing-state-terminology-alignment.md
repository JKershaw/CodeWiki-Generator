---
title: Processing state terminology alignment
category: component
related: []
created: 2025-11-22
updated: 2025-11-22
---

# Processing State Terminology Alignment

## Purpose and Overview

This component standardizes status terminology across the system to use consistent "running" and "stopped" values instead of mixed terminology. It ensures uniform state representation in user interfaces, monitoring systems, and internal processing logic.

## Key Functionality

The alignment establishes two primary status values:

- **`running`** - Indicates active processing, execution, or operational state
- **`stopped`** - Indicates inactive, halted, or non-operational state

This standardization replaces inconsistent terms like "active/inactive", "on/off", or "enabled/disabled" that were previously used across different components.

## Relationships

- **UI Components**: Status displays and controls use aligned terminology for consistent user experience
- **Monitoring Systems**: State reporting and alerts rely on standardized status values
- **API Responses**: All endpoints return uniform status fields using aligned terminology
- **Configuration Management**: Process definitions and settings use consistent state vocabulary

## Usage Examples

### Status Checking
```javascript
if (process.status === 'running') {
  // Handle active process
} else if (process.status === 'stopped') {
  // Handle inactive process
}
```

### State Updates
```javascript
// Set process to active state
updateProcessStatus(processId, 'running');

// Set process to inactive state
updateProcessStatus(processId, 'stopped');
```

### API Response Format
```json
{
  "processId": "worker-123",
  "status": "running",
  "lastUpdate": "2024-01-15T10:30:00Z"
}
```

The terminology alignment eliminates ambiguity in state management and provides a clear, binary status model that works consistently across all system components.