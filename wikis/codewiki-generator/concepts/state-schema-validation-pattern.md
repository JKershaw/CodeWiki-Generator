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

The StateManager component provides persistent, validated state management for the application, ensuring that application state is safely stored to disk, loaded back with integrity checks, and never enters an invalid state. It establishes a validation-first approach where required fields, types, and logical constraints are enforced at both load and save operations, preventing corrupt or incomplete state from affecting application behavior.

## Key Functionality

StateManager handles the complete lifecycle of application state persistence:

- **State Loading**: Asynchronously loads state from disk with automatic validation; returns sensible defaults if the file doesn't exist
- **State Saving**: Validates state before persisting to disk and creates necessary directories automatically
- **State Updates**: Merges partial state updates into the current state and persists the result
- **In-Memory Caching**: Provides fast access to state without disk I/O via `getState()`
- **Schema Validation**: Enforces required fields, type constraints, value ranges, and logical consistency rules through `_validateState()`
- **State Reset**: Restores state to a known-good default configuration

The validation schema protects the integrity of repository processing metadata including commit counts, file status, cost estimates, and error logs. All state transitions are validated to ensure the system never operates with malformed data.

## Relationships

- **File System Integration**: Uses Node.js `fs.promises` for async file operations, handling directory creation and error cases
- **Application State**: Maintains execution progress across process restarts, tracking repository analysis metadata
- **Validation Contract**: Enforces a strict schema contract that defines what constitutes valid state throughout the application lifecycle
- **Session Persistence**: Enables the application to resume long-running operations without losing progress

## Usage Example

```javascript
const StateManager = require('./lib/state-manager');
const path = require('path');

// Initialize with file path
const stateManager = new StateManager(path.join(__dirname, 'data/app-state.json'));

// Load existing state or get defaults
const state = await stateManager.loadState();

// Update part of the state (validates and saves automatically)
await stateManager.updateState({
  processedCommits: state.processedCommits + 100,
  lastUpdated: new Date().toISOString()
});

// Retrieve current in-memory state quickly
const currentState = stateManager.getState();

// Reset to default configuration if needed
await stateManager.resetState();
```

## Testing

The component has comprehensive test coverage across 16 test cases organized into 7 test suites:

- **StateManager instantiation and initialization**
- **loadState**: Default state handling, file loading, and validation on load
- **saveState**: Persistence, validation, and directory creation
- **updateState**: Partial updates and merge behavior
- **getState**: In-memory retrieval and caching
- **resetState**: Restoration to defaults
- **State validation**: Required fields, type constraints, and logical consistency enforcement

Tests are located in `tests/unit/state-manager.test.js` and verify both successful operations and error handling paths.