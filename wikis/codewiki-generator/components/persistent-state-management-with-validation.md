---
title: Persistent state management with validation
category: component
sourceFile: lib/state-manager.js
related: [meta/overview.md]
created: 2025-11-24
updated: 2025-11-25
---

# Persistent State Management with Validation

## Purpose and Overview

The StateManager provides centralized persistence of application state to disk with comprehensive validation, enabling recovery and resumability of long-running processes across application restarts. It implements a robust state management pattern that ensures data integrity through strict schema validation and combines in-memory caching with lazy loading for optimal performance.

## Key Functionality

**State Persistence**: Handles JSON serialization of application state to disk with automatic directory creation and graceful handling of missing files, providing reliable state durability across the application lifecycle.

**Schema Validation**: Implements strict validation of state structure including required fields, type checking, value constraints, and enum validation before persistence. The `_validateState` method enforces structural and value constraints to protect against corrupted state files and invalid state transitions.

**In-Memory Caching**: Maintains `currentState` in memory to avoid redundant file I/O while supporting lazy loading on first access. This optimization balances performance with ensuring consistency through periodic persistence.

**State Operations**: Provides methods for loading, saving, updating, retrieving, and resetting state, with all operations validated against the defined schema before persistence.

**Error Handling**: Gracefully handles file system errors, missing files, and validation failures, returning default states when appropriate.

## Relationships

The StateManager acts as a foundational component for other parts of the application that require persistent state across restarts. It is particularly critical for:

- Long-running repository analysis operations where state corruption could cause significant data loss
- Configuration management that requires validation
- Application state that must survive crashes or restarts
- Any component requiring reliable, validated data persistence with performance optimization

## Usage Example

```javascript
const StateManager = require('./lib/state-manager');
const path = require('path');

// Initialize state manager with file path
const testStateFile = path.join(__dirname, '../fixtures/test-state.json');
const stateManager = new StateManager(testStateFile);

// Load existing state or get default state for non-existent file
const state = await stateManager.loadState();

// Update state with validation
await stateManager.updateState({ key: 'value' });

// Get current state (uses in-memory cache)
const currentState = await stateManager.getState();

// Reset to default state
await stateManager.resetState();
```

## Testing

**Test Coverage**: `tests/unit/state-manager.test.js`
- 16 test cases across 7 test suites
- Comprehensive coverage of StateManager operations: loadState, saveState, updateState, getState, resetState, and state validation
- Tests include file system edge cases, validation scenarios, and in-memory caching behavior