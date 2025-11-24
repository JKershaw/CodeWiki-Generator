---
title: Persistent State Management with Validation
category: component
sourceFile: lib/state-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Persistent State Management with Validation

## Purpose and Overview

The `StateManager` component provides persistent, validated state management for the application, enabling execution progress to survive across process restarts. It enforces a strict validation schema to ensure state integrity, preventing invalid configurations from being loaded or saved to disk.

## Key Functionality

`StateManager` handles the complete lifecycle of application state:

- **Loading**: Asynchronously reads state from disk, validates it against the schema, and returns default state if the file doesn't exist
- **Saving**: Validates state before persisting to disk, automatically creating directories as needed
- **Updating**: Merges partial state updates with existing state and saves the result, loading from disk if necessary
- **Retrieval**: Provides in-memory access to current state without disk I/O
- **Resetting**: Clears state back to canonical defaults and persists to disk
- **Validation**: Enforces required fields, type constraints, value ranges, and logical consistency rules

The validation-first design prevents invalid state from entering the system at any point. The `_validateState()` method acts as a gatekeeper, checking all state modifications before they're stored or returned to callers.

## Relationships

`StateManager` integrates with:

- **File System Operations**: Uses Node.js `fs.promises` for async I/O operations
- **Repository Processing**: Maintains state that tracks repository analysis metadata including commits, files, processing status, cost estimates, and error logs
- **Application State**: Serves as the single source of truth for persisted execution state across sessions

## Usage Example

```javascript
const StateManager = require('./lib/state-manager');
const path = require('path');

// Initialize the state manager with a file path
const stateFile = path.join(__dirname, 'app-state.json');
const stateManager = new StateManager(stateFile);

// Load existing state or get defaults
const state = await stateManager.loadState();

// Update specific state properties
await stateManager.updateState({ 
  processedCommits: 150,
  status: 'in_progress' 
});

// Retrieve current in-memory state
const currentState = stateManager.getState();

// Reset to default state
await stateManager.resetState();
```

## Testing

The `StateManager` component has comprehensive test coverage:

- **Test File**: `tests/unit/state-manager.test.js`
- **Coverage**: 16 test cases across 7 test suites
- **Test Categories**: 
  - StateManager initialization
  - `loadState` behavior with missing/existing files
  - `saveState` validation and persistence
  - `updateState` merging and validation
  - `getState` in-memory access
  - `resetState` functionality
  - State validation rules and schema enforcement

Tests verify proper handling of edge cases including missing files, invalid state data, type mismatches, and filesystem operations.