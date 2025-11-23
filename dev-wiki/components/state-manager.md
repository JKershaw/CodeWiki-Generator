---
title: StateManager
created: 2025-11-22
updated: 2025-11-22
related: [WikiManager, Processor, Architecture]
---

# StateManager

StateManager handles persistence and validation of processing state, enabling pause/resume functionality and progress tracking.

## Purpose

Maintains the system's processing state across runs, allowing:
- **Resume from interruption**: Pick up where processing stopped
- **Progress tracking**: Know exactly where we are in the commit history
- **Cost monitoring**: Track API spending
- **Error recovery**: Restore state after crashes

## Location

`lib/state-manager.js`

## State Schema

```json
{
  "repoUrl": "https://github.com/owner/repo",
  "currentCommit": 25,
  "totalCommits": 100,
  "processedFiles": 150,
  "lastMetaAnalysis": 20,
  "status": "paused",
  "costEstimate": 3.45,
  "errors": [],
  "startTime": "2025-11-22T10:00:00Z",
  "endTime": null
}
```

### Required Fields

- **repoUrl** (string): GitHub repository URL
- **currentCommit** (number): Index of current commit (0-based)
- **totalCommits** (number): Total number of commits to process
- **status** (string): One of: `"stopped"`, `"running"`, `"paused"`

### Optional Fields

- **processedFiles** (number): Total files analyzed
- **lastMetaAnalysis** (number): Commit index of last meta-analysis
- **costEstimate** (number): Estimated cost in USD
- **errors** (array): Processing errors encountered
- **startTime** (ISO string): When processing started
- **endTime** (ISO string): When processing completed

## Key Methods

### loadState()

Loads state from disk (JSON file).

- Returns default state if file doesn't exist
- Validates loaded state
- Throws if state is corrupt or invalid
- Sets in-memory state

```javascript
const state = await stateManager.loadState();
// { repoUrl: '', currentCommit: 0, ... }
```

### saveState(state)

Saves state to disk.

- Validates state before writing
- Creates directory if needed
- Writes formatted JSON
- Updates in-memory state

```javascript
await stateManager.saveState({
  repoUrl: 'https://github.com/owner/repo',
  currentCommit: 10,
  totalCommits: 50,
  status: 'running'
});
```

### updateState(updates)

Incrementally updates specific fields.

- Loads current state if not in memory
- Merges updates with existing state
- Validates merged result
- Saves to disk

```javascript
await stateManager.updateState({
  currentCommit: 11,
  processedFiles: 25
});
```

### getState()

Returns current in-memory state without disk I/O.

```javascript
const state = stateManager.getState();
```

### resetState()

Resets to default state.

```javascript
await stateManager.resetState();
```

## Validation Rules

StateManager enforces strict validation:

### Field Type Validation

- `repoUrl`: must be string
- `currentCommit`: must be number
- `totalCommits`: must be number
- `status`: must be string

### Value Validation

- `currentCommit` >= 0 (no negative commits)
- `totalCommits` >= 0
- `currentCommit` <= `totalCommits` (can't exceed total)
- `status` must be one of: `["stopped", "running", "paused"]`

### Optional Field Validation

- `processedFiles`: must be non-negative number if present
- `costEstimate`: must be non-negative number if present
- `lastMetaAnalysis`: must be non-negative number if present

## File Format

State is stored as pretty-printed JSON:

```json
{
  "repoUrl": "https://github.com/JKershaw/CodeWiki-Generator",
  "currentCommit": 5,
  "totalCommits": 10,
  "processedFiles": 12,
  "lastMetaAnalysis": 5,
  "status": "paused",
  "costEstimate": 0.75,
  "errors": [],
  "startTime": "2025-11-22T19:00:00Z",
  "endTime": null
}
```

Default location: `./state.json` (configurable via constructor)

## Testing

**Tests**: `tests/unit/state-manager.test.js`

**Coverage**: 16 tests covering:
- Loading existing and non-existent state
- Saving with validation
- Incremental updates
- Validation of all rules
- Directory creation
- Corrupted JSON handling
- Invalid values rejection

## Usage Example

```javascript
const StateManager = require('./lib/state-manager');
const stateManager = new StateManager('./state.json');

// Initialize or load state
const state = await stateManager.loadState();

// Process commits
for (let i = state.currentCommit; i < state.totalCommits; i++) {
  await processCommit(i);

  // Update progress
  await stateManager.updateState({
    currentCommit: i + 1,
    processedFiles: state.processedFiles + filesInCommit
  });

  // Can pause and resume anytime
  if (userPausedProcessing) {
    await stateManager.updateState({ status: 'paused' });
    break;
  }
}
```

## Design Decisions

### Why JSON for State?

- **Human-readable**: Can manually inspect/edit if needed
- **Simple**: No database setup required
- **Version control friendly**: Can commit state for reproducibility
- **Portable**: Works everywhere Node.js runs

### Why Strict Validation?

- **Prevents corruption**: Catch bugs early
- **Clear errors**: Know exactly what's wrong
- **Data integrity**: State is always consistent
- **Debugging**: Invalid state = immediate failure

### Why In-Memory Cache?

- **Performance**: `getState()` doesn't hit disk
- **Consistency**: All operations see same state
- **Simplicity**: Single source of truth

### Why Separate Update Method?

- **Convenience**: Don't need to load entire state
- **Atomic**: Update and save in one operation
- **Safety**: Validation happens automatically

## Error Handling

StateManager throws descriptive errors:

```javascript
// Missing required field
Error: Missing required field: status

// Wrong type
Error: currentCommit must be a number

// Invalid value
Error: currentCommit cannot be negative

// Invalid status
Error: Invalid status: pending. Must be one of: stopped, running, paused

// Constraint violation
Error: currentCommit cannot exceed totalCommits
```

## Integration with Processor

The Processor uses StateManager to:

1. Load state at startup
2. Update `currentCommit` after each commit
3. Save `status` when pausing
4. Track `costEstimate` during processing
5. Record `errors` when issues occur
6. Set `endTime` when complete

## Future Enhancements

- State history (snapshots at intervals)
- Rollback to previous state
- State migration for schema changes
- Compression for large state files
- Multiple state slots (different processing runs)
