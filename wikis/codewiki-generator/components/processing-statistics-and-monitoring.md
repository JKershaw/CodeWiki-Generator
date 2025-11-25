---
title: Processing statistics and monitoring
category: component
sourceFile: lib/processor.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Processing Statistics and Monitoring

## Purpose and Overview

The Processing Statistics and Monitoring component provides comprehensive tracking and observability for long-running batch operations within the processor. It captures detailed metrics on commits, files, pages, and meta-analysis runs, enabling monitoring of performance, costs, and operational health during repository-scale processing tasks.

## Key Functionality

This component tracks multiple dimensions of processing activity:

- **Commit Processing Metrics**: Counts of processed commits and their associated files
- **Documentation Generation**: Tracking of wiki pages created and updated during processing
- **Meta-Analysis Monitoring**: Recording of periodic analysis runs and their outcomes
- **Cost Management**: Integration with API cost tracking to monitor resource usage
- **State Persistence**: Maintaining processing statistics across pause/resume cycles
- **Stop Reason Analysis**: Capturing why processing sessions end (completion, budget limits, errors, etc.)

The statistics are collected throughout the processing lifecycle and provide visibility into system performance, helping identify bottlenecks and optimize resource allocation.

## Relationships

The monitoring component integrates with several core system components:

- **State Manager**: Persists statistics across processing sessions for resumable operations
- **Cost-Aware API Management**: Receives cost data to track budget utilization
- **Wiki Manager**: Reports on page creation and update activities
- **Batch Processor**: Embedded within the main processing loop to capture real-time metrics
- **Meta-Analysis Agents**: Receives notifications of analysis runs and their results

## Usage Example

```javascript
describe('Processor', () => {
  let processor;
  let mockWikiManager;
  let mockStateManager;
  let mockCodeAnalysisAgent;
  let mockDocWriterAgent;
  let mockTechDebtAgent;
  let mockSecurityAgent;

  beforeEach(() => {
    // Create mock managers and agents
    mockWikiManager = {
      getPage: jest.fn(),
      createPage: jest.fn(),
      updatePage: jest.fn(),
      searchPages: jest.fn(),
      getRelatedPages: jest.fn(),
      updatePageGlobalMetadata: jest.fn()
    };

    mockStateManager = {
      loadState: jest.fn()
    };
    // Initialize processor with monitoring capabilities
  });
});
```

## Testing

**Test Coverage**: tests/unit/processor.test.js
- 26 test cases across 6 test suites
- Comprehensive testing of processor functionality including statistics collection
- Test categories cover: Processor, processCommit, isSignificantFile, getRelevantContext, determinePagePath, processRepository
- Full test suite validates monitoring integration with core processing workflows