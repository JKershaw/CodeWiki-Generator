---
title: Structured wiki organization system
category: concept
sourceFile: lib/project-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Structured Wiki Organization System

## Purpose and Overview

The structured wiki organization system provides a project-based architecture for managing documentation wikis with standardized directory structures and metadata handling. It enforces consistent organization patterns through predefined categories (concepts, components, guides, meta, history) and enables multi-project wiki management with CRUD operations and configuration persistence.

## Key Functionality

**Project Lifecycle Management**
- Creates new wiki projects with standardized directory structure
- Imports existing wiki directories as managed projects
- Deletes projects and associated files
- Manages project-specific configuration settings

**Directory Structure Enforcement**
- Automatically creates categorized directories: `concepts/`, `components/`, `guides/`, `meta/`, `history/`
- Maintains project metadata and settings in structured format
- Calculates project statistics including page counts and total size

**Multi-Project Support**
- Lists all managed projects with metadata and statistics
- Provides project-scoped operations and settings
- Supports project discovery and organization

## Relationships

- **Dashboard Integration**: Supports dashboard project listing and management functionality
- **Wiki Architecture**: Provides foundation for multi-project wiki architecture with project-scoped operations
- **Configuration Management**: Enables project-specific settings and metadata persistence

## Usage Example

```javascript
const ProjectManager = require('./lib/project-manager');

const projectManager = new ProjectManager('./wikis');

// Create a new project
const metadata = {
  name: 'Test Project',
  description: 'A test project',
  repository: 'https://github.com/test/repo'
};
await projectManager.createProject('test-project', metadata);

// Get all projects
const projects = await projectManager.getAllProjects();

// Get project metadata
const projectData = await projectManager.getProjectMetadata('test-project');
```

## Testing

**Test Coverage**: `tests/unit/project-manager.test.js`
- 13 test cases across 7 test suites
- Comprehensive coverage of ProjectManager functionality including project creation, metadata retrieval, project listing, deletion, settings management, and project import operations