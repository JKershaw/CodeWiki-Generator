---
title: Processing control API
category: component
sourceFile: lib/dashboard-controller.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Processing Control API

## Purpose and Overview

The Processing Control API provides a web-based HTTP interface for controlling repository processing operations. It serves as the bridge between the command-line processing engine and a web dashboard, offering real-time control over repository analysis with features like start, pause, step-through, and batch processing capabilities.

## Key Functionality

The `DashboardController` class orchestrates repository processing through several key operations:

- **Processing Control**: Starts, pauses, and manages repository processing workflows with URL validation and cost limits
- **Granular Processing**: Supports single-step and batch processing modes for fine-grained control over commit analysis
- **Status Management**: Provides real-time status tracking and JSON API responses for current processing state
- **Dashboard Rendering**: Serves the main dashboard interface with current processing state visualization
- **Wiki Content Delivery**: Dynamically routes URL paths to wiki markdown files with automatic file extension handling

The controller validates GitHub repository URLs using regex pattern matching and maintains processing state through integration with the StateManager component.

## Relationships

- **Orchestrates** Processor, StateManager, and WikiManager components for coordinated operation
- **Provides** HTTP interface layer over command-line processing functionality
- **Bridges** repository processing engine with web-based user interface
- **Integrates** with state management system for persistent processing control across sessions

## Usage Example

```javascript
const DashboardController = require('./lib/dashboard-controller');

// Initialize controller with required dependencies
const controller = new DashboardController(processor, stateManager, wikiManager);

// Start processing a repository
await controller.startProcessing({ url: 'https://github.com/user/repo' });

// Check current status
const status = await controller.getStatus();

// Process a single step
await controller.processStep();

// Process batch with custom count
await controller.processBatch({ count: 10 });

// Pause active processing
await controller.pauseProcessing();
```

## Testing

No automated tests found for this component.