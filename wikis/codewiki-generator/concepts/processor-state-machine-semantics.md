---
title: Processor State Machine Semantics
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Processor State Machine Semantics

## Purpose and Overview

The Processor manages asynchronous wiki documentation workflows through a well-defined state machine that tracks operational status across processing pipelines. It orchestrates interactions between multiple agents (code analysis and documentation writing) and manages state persistence, ensuring reliable workflow execution and resumption capabilities.

## Key Functionality

### State Machine Lifecycle

The processor implements a state machine with the following semantic states:

- **`processing`** → **`running`**: Indicates the processor is actively executing tasks
- **`completed`** → **`stopped`**: Terminal state indicating processing has finished

This naming convention clearly distinguishes between active processing states and terminal states, preventing confusion about processor availability and lifecycle management.

### Core Operations

**Page Management**
- `createPage(content, options)`: Creates new wiki pages with content and metadata configuration
  - Parameters ordered: core content data precedes configuration options
  - Title and other metadata are passed via the options object
- `updatePage(content, options)`: Updates existing pages with new content and metadata
  - Follows the same parameter convention as createPage for API consistency

**Path Resolution**
- `determinePagePath(conceptName)`: Converts concept names to kebab-case file paths with `.md` extension
  - Ensures consistent file naming and proper path structure across the system

**Workflow Processing**
- `processCommit()`: Analyzes repository commits and triggers documentation updates
- `processRepository()`: Processes entire repositories to identify significant files and generate relevant documentation
- `getRelevantContext()`: Gathers contextual information needed for documentation generation
- `isSignificantFile()`: Determines if a file warrants documentation attention

### State Persistence

The processor leverages StateManager to:
- Load previous processing state via `loadState()`
- Save current state via `saveState()` for recovery and resumption

## Relationships

- **WikiManager**: Provides page CRUD operations and search capabilities for wiki integration
- **StateManager**: Persists processor status and enables state recovery across sessions
- **Code Analysis Agent**: Analyzes code and generates structural insights
- **Doc Writer Agent**: Transforms analysis into formatted documentation

## Usage Example

```javascript
const Processor = require('./lib/processor');

// Initialize with dependent managers and agents
const processor = new Processor({
  wikiManager: mockWikiManager,
  stateManager: mockStateManager,
  codeAnalysisAgent: mockCodeAnalysisAgent,
  docWriterAgent: mockDocWriterAgent
});

// Process repository changes
await processor.processRepository();

// Check if a file is significant enough to document
const isSignificant = processor.isSignificantFile('src/core/feature.js');

// Generate page path from concept name
const pagePath = processor.determinePagePath('User Authentication Flow');
// Returns: 'user-authentication-flow.md'
```

## Testing

**Coverage**: 26 test cases across 6 test suites  
**Test File**: `tests/unit/processor.test.js`

Test suites cover:
- Processor initialization and state management
- `processCommit()` workflow
- `isSignificantFile()` filtering logic
- `getRelevantContext()` context gathering
- `determinePagePath()` path generation
- `processRepository()` full repository processing

All critical state transitions and API contracts are validated through the comprehensive test suite.