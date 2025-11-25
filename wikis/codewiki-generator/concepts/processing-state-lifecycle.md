---
title: Processing state lifecycle
category: concept
sourceFile: lib/processor.js
related: [meta/overview.md]
created: 2025-11-25
updated: 2025-11-25
---

# Processing State Lifecycle

## Purpose and [Overview](../meta/overview.md)

The processing state lifecycle manages the execution state of long-running processor operations using explicit state values rather than boolean flags. This creates a clearer, more extensible state machine pattern that enables better monitoring and control of processor execution phases.

## Key Functionality

The processor maintains explicit state values to track its execution lifecycle:

- **State Values**: Uses string-based states ('running', 'stopped') instead of implicit boolean flags
- **State Machine Pattern**: Provides a clear, extensible framework for managing processor execution phases
- **Lifecycle Control**: Enables precise control over when processing starts, runs, and stops
- **Monitoring**: Allows external systems to query and track processor state changes

The explicit state system replaces ambiguous boolean patterns with clear state identifiers, making the processor's behavior more predictable and easier to debug.

## Relationships

The processing state lifecycle integrates with several core components:

- **StateManager**: Persists and retrieves processor state across sessions
- **WikiManager**: Coordinates with wiki operations during different processing phases
- **Analysis Agents**: Controls when code analysis, documentation, tech debt, and security agents execute
- **Repository Processing**: Manages state during commit processing and repository analysis workflows

## Usage Example

```javascript
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent,
  techDebtAgent: mockTechDebtAgent,
  securityAgent: mockSecurityAgent
});

// State lifecycle management
processor.start(); // Sets state to 'running'
processor.processRepository(repoPath);
processor.stop(); // Sets state to 'stopped'
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive testing of processor state management
- Test categories include: Processor initialization, processCommit, isSignificantFile, getRelevantContext, determinePagePath, and processRepository
- Tests verify state transitions and lifecycle behavior under various conditions