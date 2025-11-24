---
title: Guide persistence reliability
category: concept
sourceFile: lib/processor.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Guide Persistence Reliability

## Purpose and Overview

Guide persistence reliability ensures that guide content is reliably written to disk by guaranteeing the target directory structure exists before file I/O operations. This component prevents runtime failures and silent errors during the guide generation workflow by proactively creating necessary parent directories, making the persistence layer robust and predictable.

## Key Functionality

The guide persistence mechanism uses defensive file system operations to handle directory creation before writing guide files:

- **Recursive Directory Creation**: Uses `fs.mkdir` with the `recursive` option to create the complete directory hierarchy for guide storage, ensuring parent directories exist before file operations
- **Path Resolution**: Extracts directory paths from full guide file paths using `path.dirname`, enabling targeted directory creation for any guide location
- **Workflow Integration**: Executes directory creation as a precursor to `fs.writeFile` operations, guaranteeing the file system is ready to accept guide content

This approach eliminates common file system errors like `ENOENT` (directory not found) by establishing the necessary directory structure upfront, rather than attempting recovery after failures occur.

## Relationships

- **WikiManager Integration**: Depends on `WikiManager.wikiPath` for resolving the base directory where guides are persisted
- **Workflow Position**: Precedes `fs.writeFile` operations in the guide generation pipeline, acting as a prerequisite step
- **GuideGenerationAgent Output**: Supports the `GuideGenerationAgent` by providing reliable file persistence infrastructure for generated guide output

## Usage Example

```javascript
const path = require('path');
const fs = require('fs').promises;
const wikiPath = '/path/to/wiki';

// Before writing a guide file, ensure the directory structure exists
const guideFilePath = path.join(wikiPath, 'guides', 'subfolder', 'guide.md');
const guideDirectory = path.dirname(guideFilePath);

// Recursively create directories if they don't exist
await fs.mkdir(guideDirectory, { recursive: true });

// Now safely write the guide content
await fs.writeFile(guideFilePath, guideContent);
```

## Testing

The persistence layer is covered by comprehensive test suites in `tests/unit/processor.test.js`:

- **26 test cases** across 6 test suites
- **Test coverage includes**: Processor core functionality, commit processing, file significance detection, context retrieval, page path determination, and repository processing
- **Mock infrastructure**: WikiManager, StateManager, CodeAnalysisAgent, and DocWriterAgent mocks validate integration points and directory creation logic

These tests ensure that directory creation behaves correctly when paths don't exist and that file operations succeed after directory preparation.