---
title: Wiki project lifecycle management
category: concept
sourceFile: lib/project-manager.js
related: []
created: 2025-11-24
updated: 2025-11-24
---

# Wiki Project Lifecycle Management

**Purpose and Overview**
The ProjectManager class provides complete lifecycle management for wiki projects, enabling structured organization of documentation through standardized directory hierarchies and metadata tracking. It transforms traditional wiki systems into managed projects with consistent architecture and automated statistics.

## Key Functionality

The ProjectManager handles all aspects of wiki project management:

- **Project Creation**: Establishes new projects with predefined directory structure (concepts, components, guides, meta, history)
- **Import Functionality**: Converts existing documentation directories into managed projects with generated metadata
- **Settings Management**: Provides project-specific configuration handling with persistent storage
- **Metadata Tracking**: Automatically calculates and maintains project statistics including page counts, file sizes, and last updated timestamps
- **Project Discovery**: Scans and lists all managed projects with comprehensive metadata
- **Lifecycle Operations**: Supports complete project deletion and cleanup

The system enforces a structured approach to documentation organization while maintaining flexibility for different content types and team workflows.

## Relationships

- **Dashboard Integration**: Powers project management interfaces with metadata and statistics
- **Wiki System Extension**: Enhances existing wiki functionality without replacing core features
- **File System Management**: Works alongside traditional file-based wiki operations with structured organization

## Usage Example

```javascript
const ProjectManager = require('./lib/project-manager');

// Initialize project manager
const projectManager = new ProjectManager('./wikis');

// Create new project with metadata
const projectName = 'test-project';
const metadata = {
  name: 'Test Project',
  description: 'A test project',
  repository: 'https://github.com/test/repo'
};

await projectManager.createProject(projectName, metadata);

// Get project information
const projects = await projectManager.getAllProjects();
const projectMetadata = await projectManager.getProjectMetadata(projectName);
```

## Testing

**Test Coverage**: tests/unit/project-manager.test.js
- 13 test cases across 7 test suites
- Comprehensive coverage including project creation, metadata management, import functionality, settings updates, and project deletion
- Test categories: ProjectManager initialization, createProject, getProjectMetadata, getAllProjects, deleteProject, updateProjectSettings, importProject