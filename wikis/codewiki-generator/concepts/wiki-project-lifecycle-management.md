---
title: Wiki project lifecycle management
category: concept
sourceFile: lib/project-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Project Lifecycle Management

## Purpose and Overview

The ProjectManager class provides comprehensive lifecycle management for wiki projects, establishing a standardized project-based architecture that organizes documentation into structured directories with metadata tracking. It enables creation, import, configuration, and deletion of wiki projects while maintaining consistent organization patterns across all managed wikis.

## Key Functionality

**Project Creation & Structure**: Creates new wiki projects with a standardized directory structure including `concepts/`, `components/`, `guides/`, `meta/`, and `history/` folders. Each project maintains its own metadata file for configuration and tracking.

**Project Import & Migration**: Imports existing wiki directories into the managed project system, allowing migration of legacy documentation while preserving existing content and structure.

**Configuration Management**: Handles project-specific settings with validation and persistence, enabling customized behavior per project while maintaining system-wide consistency.

**Statistics & Monitoring**: Calculates and tracks project statistics including page counts, total file sizes, and metadata for dashboard display and project management.

**CRUD Operations**: Provides complete project lifecycle management including creation, retrieval, updates, and deletion with proper cleanup of associated files and directories.

## Relationships

- **Dashboard Integration**: Supports dashboard project listing and management functionality by providing project metadata and statistics
- **Multi-Project Architecture**: Serves as the foundation for supporting multiple wiki projects within a single application instance
- **Scoped Operations**: Enables project-specific wiki operations and settings, allowing isolated management of different documentation sets

## Usage Example

```javascript
const ProjectManager = require('./lib/project-manager');

// Initialize project manager with wikis directory
const projectManager = new ProjectManager('./wikis');

// Create a new project
const metadata = {
  name: 'Test Project',
  description: 'A test project',
  repository: 'https://github.com/test/repo'
};
await projectManager.createProject('test-project', metadata);

// Get project metadata and statistics
const projectData = await projectManager.getProjectMetadata('test-project');

// List all managed projects
const allProjects = await projectManager.getAllProjects();
```

## Testing

**Test Coverage**: Comprehensive test suite in `tests/unit/project-manager.test.js`
- 13 test cases across 7 test suites
- Test categories: ProjectManager initialization, createProject, getProjectMetadata, getAllProjects, deleteProject, updateProjectSettings, importProject
- Covers project creation, metadata handling, statistics calculation, and project lifecycle operations