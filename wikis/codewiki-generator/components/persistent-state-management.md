---
title: Persistent State Management
category: component
sourceFile: lib/state-manager.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Persistent State Management

## Purpose and [Overview](../meta/overview.md)

The StateManager class provides persistent state management with file-based storage for tracking application state across sessions. It ensures state integrity through comprehensive validation and handles file system operations gracefully with automatic defaults for missing files.

## Key Functionality

- **State Persistence**: Loads and saves application state to JSON files with automatic directory creation
- **Validation and Integrity**: Enforces required fields, type validation, value constraints, and business logic rules (e.g., currentCommit cannot exceed totalCommits)
- **Graceful Error Handling**: Returns sensible defaults for missing files while distinguishing between file-not-found errors and validation failures
- **State Operations**: Supports loading, saving, updating, resetting, and retrieving current state
- **Atomic Updates**: Provides safe state modification methods that maintain consistency

## Relationships

StateManager serves as a core infrastructure component that other system components depend on for:
- Processing progress tracking across sessions
- Configuration persistence
- System state recovery after restarts
- Maintaining application consistency between runs

## Usage Example

```javascript
const StateManager = require('./lib/state-manager');
const path = require('path');

// Initialize with state file path
const stateFile = path.join(__dirname, 'app-state.json');
const stateManager = new StateManager(stateFile);

// Load existing state or get defaults
const state = await stateManager.loadState();

// Update state
await stateManager.updateState({ currentCommit: 5, totalCommits: 10 });

// Get current state
const currentState = stateManager.getState();

// Reset to defaults if needed
await stateManager.resetState();
```

## Testing

**Test Coverage**: `tests/unit/state-manager.test.js`
- 16 test cases across 7 test suites
- Covers: StateManager initialization, loadState, saveState, updateState, getState, resetState, and state validation
- Tests include file system error handling, validation logic, and default state behavior