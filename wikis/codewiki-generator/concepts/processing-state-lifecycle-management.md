---
title: Processing state lifecycle management
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Processing State Lifecycle Management

## Purpose and Overview

The processing state lifecycle management system provides explicit state transitions for tracking job execution phases in the processor. It uses semantic state distinctions ('running' vs 'processing', 'stopped' vs 'completed') to improve state machine clarity and enable better monitoring and resumption logic.

## Key Functionality

The processor manages distinct state phases throughout its execution lifecycle:

- **Initialization States**: Setting up processors and loading previous state
- **Execution States**: Distinguishing between 'running' (active) and 'processing' (working on specific tasks)
- **Completion States**: Differentiating between 'stopped' (interrupted) and 'completed' (finished successfully)
- **State Persistence**: Working with StateManager to maintain state across sessions
- **State Transitions**: Clear semantic meaning for each state change to support monitoring systems

The state management integrates with repository processing, commit analysis, and documentation generation workflows to provide consistent lifecycle tracking across all processor operations.

## Relationships

This component is central to the processor architecture and connects to:

- **StateManager**: Loads and persists processing state across sessions
- **WikiManager**: State affects page creation and updates during processing
- **Analysis Agents**: State transitions coordinate with code analysis, documentation writing, tech debt, and security agents
- **Repository Processing**: State management controls the flow of commit processing and file analysis
- **Monitoring Systems**: Explicit states enable external systems to track processing progress

## Usage Example

```javascript
describe('Processor', () => {
  let processor;
  let mockStateManager;

  beforeEach(() => {
    mockStateManager = {
      loadState: jest.fn(),
      saveState: jest.fn(),
      getState: jest.fn()
    };

    processor = new Processor({
      stateManager: mockStateManager,
      wikiManager: mockWikiManager
    });
  });

  // State transitions during processing
  it('should manage processing lifecycle states', async () => {
    await processor.start(); // transitions to 'running'
    await processor.processRepository(); // transitions to 'processing' 
    await processor.complete(); // transitions to 'completed'
  });
});
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive testing of state transitions and lifecycle management
- Test categories include: Processor initialization, processCommit workflow, repository processing states, and state persistence patterns