---
title: Structured wiki project architecture
category: concept
sourceFile: lib/project-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Structured Wiki Project Architecture

## Purpose and Overview

The structured wiki project architecture provides a standardized framework for organizing and managing wiki projects with predefined directory structures and metadata tracking. It establishes a complete lifecycle management system that transforms loose documentation into organized, manageable projects with consistent structure and automated statistics.

## Key Functionality

The `ProjectManager` class handles all aspects of wiki project lifecycle:

- **Project Creation**: Creates new projects with standardized directory structure including `/concepts`, `/components`, `/guides`, `/meta`, and `/history` folders
- **Project Import**: Converts existing documentation directories into managed projects with automatic metadata generation
- **Metadata Management**: Tracks project information, settings, and calculated statistics (page counts, file sizes, last updated timestamps)
- **Project Statistics**: Automatically calculates and maintains project metrics including page counts per category and total project size
- **Settings Management**: Provides project-specific configuration that can be updated and persisted
- **Project Discovery**: Lists all managed projects with metadata, sorted by most recently updated

The architecture enforces a consistent structure where documentation is categorized into concepts (high-level ideas), components (code elements), guides (how-to documentation), meta (project information), and history (change tracking).

## Relationships

- Integrates with dashboard components to provide project management UI functionality
- Works alongside the existing wiki system to add structured organization on top of content management
- Complements file-based wiki operations with project-level abstractions and metadata tracking

## Usage Example

```javascript
const ProjectManager = require('./lib/project-manager');

// Initialize project manager with wikis directory
const projectManager = new ProjectManager('./wikis');

// Create a new project with metadata
const metadata = {
  name: 'Test Project',
  description: 'A test project',
  repository: 'https://github.com/test/repo'
};

await projectManager.createProject('test-project', metadata);

// Get project metadata with calculated statistics
const projectData = await projectManager.getProjectMetadata('test-project');

// List all managed projects
const allProjects = await projectManager.getAllProjects();
```

## Testing

**Test Coverage**: `tests/unit/project-manager.test.js`
- 13 test cases across 7 test suites
- Comprehensive coverage including: ProjectManager initialization, createProject, getProjectMetadata, getAllProjects, deleteProject, updateProjectSettings, and importProject functionality