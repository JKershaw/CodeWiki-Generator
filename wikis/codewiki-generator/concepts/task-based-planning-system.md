---
title: Task-based planning system
category: concept
sourceFile: lib/planning-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Task-based planning system

## Purpose and Overview

The task-based planning system provides a structured approach to managing documentation work through organized tasks with lifecycle tracking, priorities, and file-based persistence. It serves as a backend management system for coordinating documentation efforts across projects within the codebase wiki.

## Key Functionality

The `PlanningManager` class handles complete task lifecycle management:

- **Task CRUD Operations**: Creates, reads, updates, and deletes tasks with automatic ID generation and validation
- **Status Tracking**: Manages task progression through todo, in-progress, and done states with automatic completion timestamps
- **Priority Management**: Organizes tasks by high, medium, and low priority levels
- **File Persistence**: Stores tasks in JSON files organized by project structure
- **Querying and Filtering**: Provides methods to filter tasks by status and priority
- **Statistics**: Calculates completion metrics and task distribution analytics
- **Data Validation**: Ensures task data integrity with comprehensive validation of structure, types, and enum values

## Relationships

The planning system integrates with the existing wiki architecture by:
- Using project-based file organization that mirrors the wiki structure
- Extending dashboard functionality by providing task management backend capabilities
- Complementing the existing documentation system with workflow planning tools

## Usage Example

```javascript
const PlanningManager = require('./lib/planning-manager');

// Initialize planning manager
const planningManager = new PlanningManager('./wikis');

// Create a new task
const task = await planningManager.createTask('my-project', {
  title: 'Update API documentation',
  description: 'Review and update REST API docs',
  priority: 'high',
  status: 'todo',
  assignedPages: ['api.md']
});

// Get tasks by status
const todoTasks = await planningManager.getTasksByStatus('my-project', 'todo');

// Update task status
await planningManager.updateTask('my-project', task.id, {
  status: 'in-progress'
});

// Get project statistics
const stats = await planningManager.getStatistics('my-project');
```

## Testing

**Test Coverage**: tests/unit/planning-manager.test.js
- 20 test cases across 8 test suites
- Comprehensive coverage of all CRUD operations, filtering, validation, and statistics functionality
- Tests include error handling scenarios and edge cases for file operations and data validation