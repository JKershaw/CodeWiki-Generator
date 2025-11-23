---
title: State-based Process Control
category: concept
sourceFile: Not specified
related: [components/dashboard-controller.md]
created: 2025-11-23
updated: 2025-11-23
---

# State-based Process Control

## Purpose and Overview

The State-based Process Control system provides granular control over the wiki generation workflow through a web dashboard interface. It enables users to pause, resume, and step through repository processing operations while maintaining state persistence across sessions.

## Key Functionality

This component implements sophisticated process control capabilities:

- **Flexible Processing Modes**: Supports automatic, step-by-step, and batch processing workflows
- **State Management**: Tracks processing progress and allows pause/resume operations
- **Web Interface**: Provides HTTP endpoints for dashboard control and status monitoring
- **Concurrent Processing Prevention**: Ensures only one repository processes at a time
- **Error Handling**: Captures and reports processing errors while maintaining system stability

The controller coordinates between the web interface and the core processing pipeline, translating user actions into appropriate state transitions and processing commands.

## Relationships

The State-based Process Control acts as the orchestration layer connecting:

- **Processor**: Delegates actual repository analysis and commit processing
- **StateManager**: Persists and retrieves processing state across sessions  
- **WikiManager**: Handles wiki page generation and serving
- **Web Dashboard**: Provides the user interface for process control

It extends the core processing system by adding interactive control capabilities while maintaining the existing multi-phase processing architecture.

## Usage Example

```javascript
const DashboardController = require('./dashboard-controller');
const express = require('express');

const app = express();
const controller = new [DashboardController](../components/dashboard-controller.md)();

// Start processing a repository
app.post('/start', async (req, res) => {
  const { repoUrl } = req.body;
  try {
    await controller.startProcessing(repoUrl);
    res.json({ status: 'processing_started' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Process single step with granular control
app.post('/step', async (req, res) => {
  const result = await controller.processStep();
  res.json(result);
});

// Get current processing status
app.get('/status', async (req, res) => {
  const status = await controller.getStatus();
  res.json(status);
});
```

## Testing

No automated tests are currently available for this component. Test coverage should focus on state transitions, error handling during processing operations, and validation of GitHub repository URLs.