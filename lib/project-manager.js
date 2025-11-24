const fs = require('fs').promises;
const path = require('path');

/**
 * ProjectManager handles wiki project lifecycle management
 * Supports creating, importing, deleting, and configuring wiki projects
 */
class ProjectManager {
  constructor(wikisBasePath = './wikis') {
    this.wikisBasePath = wikisBasePath;
  }

  /**
   * Create a new wiki project directory with metadata
   * @param {string} name - Project name (used as directory name)
   * @param {Object} metadata - Project metadata
   * @returns {Promise<Object>} Created project metadata
   */
  async createProject(name, metadata = {}) {
    // Validate project name
    if (!name || typeof name !== 'string') {
      throw new Error('Project name is required');
    }

    // Sanitize project name for file system
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const projectPath = path.join(this.wikisBasePath, sanitizedName);

    // Check if project already exists
    try {
      await fs.access(projectPath);
      throw new Error(`Project "${sanitizedName}" already exists`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Create project directory structure
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(path.join(projectPath, 'concepts'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'components'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'guides'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'meta'), { recursive: true });
    await fs.mkdir(path.join(projectPath, 'history'), { recursive: true });

    // Create project metadata
    const projectMetadata = {
      name: metadata.name || sanitizedName,
      description: metadata.description || '',
      repository: metadata.repository || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        theme: metadata.theme || 'default',
        maxPageSize: metadata.maxPageSize || 5000,
        ...metadata.settings
      }
    };

    // Save metadata file
    const metadataPath = path.join(projectPath, '_project.json');
    await fs.writeFile(metadataPath, JSON.stringify(projectMetadata, null, 2));

    // Create initial index.md
    const indexContent = `# ${projectMetadata.name}

${projectMetadata.description}

## Getting Started

This is a newly created wiki project. Start by adding documentation pages.

## Structure

- **concepts/** - Architectural patterns and design decisions
- **components/** - Implementation details of specific modules
- **guides/** - Step-by-step instructions
- **meta/** - Project philosophy and specifications
- **history/** - Project evolution and progress reports
`;

    await fs.writeFile(path.join(projectPath, 'index.md'), indexContent);

    return {
      id: sanitizedName,
      ...projectMetadata
    };
  }

  /**
   * Import existing wiki from a directory
   * @param {string} sourcePath - Path to existing wiki directory
   * @param {string} name - Name for the imported project
   * @returns {Promise<Object>} Imported project metadata
   */
  async importProject(sourcePath, name) {
    if (!sourcePath) {
      throw new Error('Source path is required');
    }

    if (!name) {
      throw new Error('Project name is required');
    }

    // Check if source exists
    try {
      const stats = await fs.stat(sourcePath);
      if (!stats.isDirectory()) {
        throw new Error('Source path must be a directory');
      }
    } catch (error) {
      throw new Error(`Source path does not exist: ${sourcePath}`);
    }

    // Sanitize project name
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const projectPath = path.join(this.wikisBasePath, sanitizedName);

    // Check if project already exists
    try {
      await fs.access(projectPath);
      throw new Error(`Project "${sanitizedName}" already exists`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Create project directory
    await fs.mkdir(projectPath, { recursive: true });

    // Copy all files from source
    await this._copyDirectory(sourcePath, projectPath);

    // Check if _project.json exists, create if not
    const metadataPath = path.join(projectPath, '_project.json');
    let projectMetadata;

    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      projectMetadata = JSON.parse(metadataContent);
      projectMetadata.updatedAt = new Date().toISOString();
    } catch (error) {
      // Create new metadata if it doesn't exist
      projectMetadata = {
        name: sanitizedName,
        description: 'Imported wiki project',
        repository: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          theme: 'default',
          maxPageSize: 5000
        }
      };
      await fs.writeFile(metadataPath, JSON.stringify(projectMetadata, null, 2));
    }

    return {
      id: sanitizedName,
      ...projectMetadata
    };
  }

  /**
   * Delete a project
   * @param {string} name - Project name to delete
   * @returns {Promise<void>}
   */
  async deleteProject(name) {
    if (!name) {
      throw new Error('Project name is required');
    }

    const projectPath = path.join(this.wikisBasePath, name);

    // Check if project exists
    try {
      await fs.access(projectPath);
    } catch (error) {
      throw new Error(`Project "${name}" not found`);
    }

    // Delete project directory recursively
    await fs.rm(projectPath, { recursive: true, force: true });
  }

  /**
   * Get project settings
   * @param {string} name - Project name
   * @returns {Promise<Object>} Project settings
   */
  async getProjectSettings(name) {
    const metadata = await this.getProjectMetadata(name);
    return metadata.settings || {};
  }

  /**
   * Update project settings
   * @param {string} name - Project name
   * @param {Object} settings - Settings to update
   * @returns {Promise<Object>} Updated settings
   */
  async updateProjectSettings(name, settings) {
    const metadata = await this.getProjectMetadata(name);

    // Merge settings
    metadata.settings = {
      ...metadata.settings,
      ...settings
    };

    metadata.updatedAt = new Date().toISOString();

    // Save updated metadata
    const metadataPath = path.join(this.wikisBasePath, name, '_project.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return metadata.settings;
  }

  /**
   * Get project metadata for display
   * @param {string} name - Project name
   * @returns {Promise<Object>} Project metadata with stats
   */
  async getProjectMetadata(name) {
    if (!name) {
      throw new Error('Project name is required');
    }

    const projectPath = path.join(this.wikisBasePath, name);
    const metadataPath = path.join(projectPath, '_project.json');

    // Check if project exists
    try {
      await fs.access(projectPath);
    } catch (error) {
      throw new Error(`Project "${name}" not found`);
    }

    // Read metadata
    let metadata;
    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      metadata = JSON.parse(metadataContent);
    } catch (error) {
      // Create default metadata if file doesn't exist
      metadata = {
        name: name,
        description: '',
        repository: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          theme: 'default',
          maxPageSize: 5000
        }
      };
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    }

    // Get statistics
    const stats = await this._getProjectStats(projectPath);

    return {
      id: name,
      ...metadata,
      stats
    };
  }

  /**
   * Get all projects with metadata
   * @returns {Promise<Array>} Array of project metadata objects
   */
  async getAllProjects() {
    try {
      await fs.access(this.wikisBasePath);
    } catch (error) {
      // Create wikis directory if it doesn't exist
      await fs.mkdir(this.wikisBasePath, { recursive: true });
      return [];
    }

    const entries = await fs.readdir(this.wikisBasePath, { withFileTypes: true });
    const projects = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const metadata = await this.getProjectMetadata(entry.name);
          projects.push(metadata);
        } catch (error) {
          console.warn(`Could not load metadata for project ${entry.name}:`, error.message);
        }
      }
    }

    // Sort by updated date (newest first)
    projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return projects;
  }

  /**
   * Copy directory recursively
   * @private
   */
  async _copyDirectory(source, destination) {
    await fs.mkdir(destination, { recursive: true });

    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await this._copyDirectory(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }
  }

  /**
   * Get project statistics
   * @private
   */
  async _getProjectStats(projectPath) {
    const stats = {
      pageCount: 0,
      conceptPages: 0,
      componentPages: 0,
      guidePages: 0,
      totalSize: 0,
      lastUpdated: null
    };

    try {
      // Count markdown files in different directories
      stats.conceptPages = await this._countMarkdownFiles(path.join(projectPath, 'concepts'));
      stats.componentPages = await this._countMarkdownFiles(path.join(projectPath, 'components'));
      stats.guidePages = await this._countMarkdownFiles(path.join(projectPath, 'guides'));
      stats.pageCount = stats.conceptPages + stats.componentPages + stats.guidePages;

      // Get total size
      stats.totalSize = await this._getDirectorySize(projectPath);

      // Get last updated from directory modification time
      const dirStats = await fs.stat(projectPath);
      stats.lastUpdated = dirStats.mtime.toISOString();
    } catch (error) {
      console.warn('Error calculating stats:', error.message);
    }

    return stats;
  }

  /**
   * Count markdown files in a directory
   * @private
   */
  async _countMarkdownFiles(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      let count = 0;

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          count++;
        } else if (entry.isDirectory()) {
          count += await this._countMarkdownFiles(path.join(dirPath, entry.name));
        }
      }

      return count;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get total size of directory in bytes
   * @private
   */
  async _getDirectorySize(dirPath) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      let totalSize = 0;

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isFile()) {
          const stats = await fs.stat(fullPath);
          totalSize += stats.size;
        } else if (entry.isDirectory()) {
          totalSize += await this._getDirectorySize(fullPath);
        }
      }

      return totalSize;
    } catch (error) {
      return 0;
    }
  }
}

module.exports = ProjectManager;
