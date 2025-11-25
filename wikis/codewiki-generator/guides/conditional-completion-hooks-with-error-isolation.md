---
title: Conditional completion hooks with error isolation
category: guide
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Conditional Completion Hooks with Error Isolation

## Purpose and Overview

This pattern enables optional enhancement features to execute after main processing completes while maintaining system robustness through error isolation. The system conditionally invokes post-processing hooks only on successful completion and catches any failures to prevent interruption of the primary workflow.

## Key Functionality

The conditional completion hooks pattern works by:

- **Conditional Execution**: Hooks only execute when main processing succeeds (not stopped or stopped for cost limits)
- **Error Isolation**: Hook failures are caught and logged without interrupting the main process
- **Non-blocking Enhancement**: Optional features like wiki index generation enhance functionality without risking core operations
- **Graceful Degradation**: System continues operating normally even if enhancement hooks fail

The pattern is implemented through try-catch blocks around optional post-processing methods, with execution gates that check processing status before invocation.

## Relationships

This pattern is implemented within the **Multi-agent documentation pipeline** architecture, specifically in the processor component that orchestrates agent execution. It connects to:

- **WikiIndexAgent**: Primary consumer that generates navigational indices after successful documentation generation
- **State Management**: Relies on processing state to determine when to execute hooks
- **Error Handling System**: Integrates with logging infrastructure to capture hook failures
- **Post-processing Components**: Framework for any optional enhancements that should run after core processing

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

// Main processing completes successfully
await processor.processRepository(repoPath);

// Conditional hook executes only on success
// generateWikiIndex method is called internally with error isolation
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Test categories include: Processor, processCommit, isSignificantFile, getRelevantContext, determinePagePath, processRepository
- Tests verify conditional execution logic and error isolation behavior