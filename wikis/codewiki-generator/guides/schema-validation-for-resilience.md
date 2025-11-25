---
title: Schema validation for resilience
category: guide
sourceFile: lib/state-manager.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Schema Validation for Resilience

## Purpose and Overview

The schema validation system in StateManager enforces structural and value constraints on state objects to protect against corrupted state files and invalid state transitions. This defensive validation pattern ensures system reliability during long-running repository analysis operations where state corruption could cause significant data loss.

## Key Functionality

The `_validateState` method performs comprehensive validation of state objects by:

- **Structural validation**: Verifies that required properties exist and have correct data types
- **Value constraints**: Ensures state values fall within acceptable ranges and formats
- **Data integrity checks**: Validates relationships between different state properties
- **Error prevention**: Blocks invalid state transitions that could compromise system stability

The validation occurs automatically during state loading and before state persistence, creating a protective barrier around the state management layer.

## Relationships

Schema validation integrates closely with:

- **Persistent state management**: Validates data before writing to disk and after reading from files
- **In-memory state caching**: Ensures cached state maintains integrity throughout the application lifecycle
- **StateManager core operations**: All state modifications pass through validation to maintain consistency

## Usage Example

```javascript
const StateManager = require('./lib/state-manager');
const path = require('path');

// Initialize StateManager with state file path
const testStateFile = path.join(__dirname, 'fixtures/test-state.json');
const stateManager = new StateManager(testStateFile);

// Load state (validation occurs automatically)
const state = await stateManager.loadState();

// Update state (validation ensures integrity)
await stateManager.updateState({ 
  processedFiles: 150,
  lastUpdate: new Date().toISOString()
});
```

## Testing

**Test Coverage**: tests/unit/state-manager.test.js
- 16 test cases across 7 test suites
- Comprehensive validation testing including StateManager core functionality, loadState, saveState, updateState, getState, resetState operations, and dedicated state validation test cases
- Test fixtures located in fixtures/test-state.json for consistent validation scenarios