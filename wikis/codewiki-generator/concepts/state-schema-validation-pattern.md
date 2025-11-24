---
title: State Schema Validation Pattern
category: concept
sourceFile: lib/state-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# State Schema Validation Pattern

## Purpose and Overview

The State Schema Validation Pattern provides a centralized mechanism for persisting application state to disk with comprehensive validation. It ensures data integrity through strict schema validation while enabling recovery and resumability of long-running processes across application restarts.

## Key Functionality

- **State Persistence**: Serializes application state to JSON files with automatic directory creation and graceful handling of missing files
- **Schema Validation**: Implements strict validation including required field checking, type validation, value constraints, and enum validation before persistence
- **State Management**: Provides methods to load, save, update, get, and reset application state
- **Error Handling**: Prevents invalid states from being saved by establishing a validation contract that must be satisfied
- **Default State Support**: Returns sensible defaults when state files don't exist or are corrupted

The validation pattern ensures that only valid state structures are persisted, preventing runtime errors and maintaining data consistency across application sessions.

## Relationships

- **File System**: Directly interacts with the file system for JSON persistence and directory management
- **Application Components**: Serves as the central state authority that other components can rely on for persistent data
- **Long-running Processes**: Enables processes to resume from their last valid state after interruption or restart
- **Validation Layer**: Acts as a gatekeeper between application logic and persistent storage

## Usage Example

```javascript
const StateManager = require('./lib/state-manager');
const path = require('path');

// Initialize with state file path
const stateFile = path.join(__dirname, 'app-state.json');
const stateManager = new StateManager(stateFile);

// Load existing state or get defaults
const currentState = await stateManager.loadState();

// Update state with validation
await stateManager.updateState({ status: 'processing', progress: 50 });

// Get current state
const state = stateManager.getState();

// Reset to default state
await stateManager.resetState();
```

## Testing

**Test Coverage**: tests/unit/state-manager.test.js
- 16 test cases across 7 test suites
- Comprehensive testing of StateManager, loadState, saveState, updateState, getState, resetState, and state validation
- Includes edge cases for file handling and validation scenarios