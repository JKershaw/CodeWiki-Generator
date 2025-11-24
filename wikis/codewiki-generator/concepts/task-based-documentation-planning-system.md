---
title: Task-based documentation planning system
category: concept
sourceFile: lib/planning-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Task-based Documentation Planning System

## Purpose and Overview

The Task-based documentation planning system provides comprehensive task management capabilities for organizing and tracking documentation work. It enables teams to create, manage, and monitor documentation tasks with priority levels, status tracking, and assignment to specific pages within the wiki system.

## Key Functionality

The `PlanningManager` class serves as the central component for task management operations:

- **Task Lifecycle Management**: Creates tasks with unique IDs, updates task status (todo, in-progress, done), and handles automatic completion timestamps
- **Data Persistence**: Saves tasks to JSON files with metadata and validates task data structure on load
- **Filtering and Organization**: Retrieves tasks by status or priority level for organized workflow management
- **Statistics and Reporting**: Generates comprehensive statistics about task completion rates and distribution across priorities
- **Page Assignment**: Links tasks to specific documentation pages within the wiki structure

Tasks support priority levels (high, medium, low) and include fields for title, description, assigned pages, creation timestamps, and completion tracking.

## Relationships

The planning system integrates seamlessly with the existing wiki infrastructure:

- Uses the same `wikisBasePath` configuration as other wiki components
- Follows the JSON file persistence pattern established by the broader codebase
- Supports direct assignment of tasks to specific documentation pages within the wiki structure
- Maintains consistency with the project-based organization used throughout the system

## Usage Example

```javascript
const PlanningManager = require('./lib/planning-manager');

// Initialize the planning manager
const planningManager = new PlanningManager('./wikis');

// Create a new documentation task
const task = await planningManager.createTask('test-project', {
  title: 'Update API Documentation',
  description: 'Revise authentication section',
  priority: 'high',
  assignedPages: ['api/auth.md']
});

// Update task status
await planningManager.updateTask('test-project', task.id, {
  status: 'in-progress'
});

// Get tasks by status
const todoTasks = await planningManager.getTasksByStatus('test-project', 'todo');

// Generate project statistics
const stats = await planningManager.getStatistics('test-project');
```

## Testing

**Test Coverage**: tests/unit/planning-manager.test.js
- 20 test cases across 8 test suites
- Comprehensive coverage of core functionality: task CRUD operations, filtering, statistics generation, and data validation
- Test categories include PlanningManager initialization, getTasks, createTask, updateTask, deleteTask, getStatistics, getTasksByStatus, and getTasksByPriority