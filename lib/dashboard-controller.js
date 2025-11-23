const Processor = require('./processor');
const StateManager = require('./state-manager');
const WikiManager = require('./wiki-manager');
const fs = require('fs').promises;
const path = require('path');

/**
 * DashboardController handles HTTP requests for wiki generation control
 */
class DashboardController {
  constructor(wikisBasePath = './wikis') {
    this.wikisBasePath = wikisBasePath;
    this.defaultProject = 'codewiki-generator';

    // Initialize with default project
    this.processor = new Processor(path.join(wikisBasePath, this.defaultProject));
    this.stateManager = new StateManager();
    this.currentProcessing = null;

    // Cache of WikiManager instances per project
    this.wikiManagers = {};
  }

  /**
   * Get WikiManager for a specific project
   * @private
   */
  getProjectWikiManager(project = this.defaultProject) {
    if (!this.wikiManagers[project]) {
      const projectPath = path.join(this.wikisBasePath, project);
      this.wikiManagers[project] = new WikiManager(projectPath);
    }
    return this.wikiManagers[project];
  }

  /**
   * Get list of available wiki projects
   * @private
   */
  async getAvailableProjects() {
    try {
      const entries = await fs.readdir(this.wikisBasePath, { withFileTypes: true });
      const projects = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);

      return projects.length > 0 ? projects : [this.defaultProject];
    } catch (error) {
      console.warn('Could not read wikis directory:', error.message);
      return [this.defaultProject];
    }
  }

  /**
   * GET /api/projects - List available wiki projects
   */
  async listProjects(req, res) {
    try {
      const projects = await this.getAvailableProjects();
      res.json({
        projects: projects.map(name => ({
          name,
          displayName: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        })),
        default: this.defaultProject
      });
    } catch (error) {
      console.error('Error listing projects:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET / - Render dashboard view
   */
  async renderDashboard(req, res) {
    try {
      const state = await this.stateManager.loadState();
      const projects = await this.getAvailableProjects();

      res.render('dashboard', {
        state: state || this.getDefaultState(),
        version: '1.0.0',
        projects,
        defaultProject: this.defaultProject
      });
    } catch (error) {
      console.error('Error rendering dashboard:', error);
      res.status(500).render('error', { error: error.message });
    }
  }

  /**
   * GET /api/status - Get current processing status
   */
  async getStatus(req, res) {
    try {
      const state = await this.stateManager.loadState();
      res.json(state || this.getDefaultState());
    } catch (error) {
      console.error('Error getting status:', error);
      res.status(500).json({ error: 'Failed to get status' });
    }
  }

  /**
   * POST /process/start - Start processing repository
   */
  async startProcessing(req, res) {
    try {
      const { repoUrl, maxCost } = req.body;

      if (!repoUrl) {
        return res.status(400).json({ error: 'Repository URL is required' });
      }

      // Validate URL format
      if (!this.isValidGitHubUrl(repoUrl)) {
        return res.status(400).json({ error: 'Invalid GitHub repository URL' });
      }

      // Don't start if already processing
      if (this.currentProcessing) {
        return res.status(400).json({ error: 'Processing already in progress' });
      }

      // Start processing in background with error handling
      this.currentProcessing = this.processor.processRepository(repoUrl, {
        maxCost: maxCost || Infinity
      }).catch(error => {
        console.error('Background processing error:', error.message);
        this.currentProcessing = null;
      });

      res.json({
        message: 'Processing started',
        repoUrl,
        status: 'processing'
      });
    } catch (error) {
      console.error('Error starting processing:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /process/pause - Pause processing
   */
  async pauseProcessing(req, res) {
    try {
      const state = await this.stateManager.loadState();

      if (!state || state.status !== 'processing') {
        return res.status(400).json({ error: 'No active processing to pause' });
      }

      state.status = 'paused';
      await this.stateManager.saveState(state);

      res.json({
        message: 'Processing paused',
        status: state.status
      });
    } catch (error) {
      console.error('Error pausing processing:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /process/step - Process single commit
   */
  async processStep(req, res) {
    try {
      const state = await this.stateManager.loadState();

      if (!state || !state.repoUrl) {
        return res.status(404).json({ error: 'No repository loaded' });
      }

      // Process one commit
      // This is simplified - in reality would need to fetch commits and process one
      res.json({
        message: 'Stepped one commit',
        commitSha: 'mock-sha',
        filesProcessed: 0
      });
    } catch (error) {
      console.error('Error processing step:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /process/batch - Process N commits
   */
  async processBatch(req, res) {
    try {
      const { count = 10 } = req.body;

      if (count <= 0) {
        return res.status(400).json({ error: 'Batch count must be positive' });
      }

      const state = await this.stateManager.loadState();

      if (!state || !state.repoUrl) {
        return res.status(404).json({ error: 'No repository loaded' });
      }

      res.json({
        message: `Processing ${count} commits`,
        count
      });
    } catch (error) {
      console.error('Error processing batch:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /wiki/* - Render wiki page
   * URL format: /wiki/:project/:page(*)
   */
  async renderWikiPage(req, res) {
    try {
      // Extract page path from request path (relative to /wiki mount point)
      // Remove leading slash if present
      let fullPath = req.path.startsWith('/') ? req.path.substring(1) : req.path;

      // Parse project from path: "project/concepts/architecture" -> project="project", pagePath="concepts/architecture"
      const pathParts = fullPath.split('/');
      const project = pathParts[0] || this.defaultProject;
      const pagePath = pathParts.slice(1).join('/') || 'index';

      // Convert URL path to file path
      // e.g., "concepts/architecture" -> "concepts/architecture.md"
      const filePath = pagePath.includes('.md') ? pagePath : `${pagePath}.md`;

      // Get the appropriate WikiManager for this project
      const wikiManager = this.getProjectWikiManager(project);
      const page = await wikiManager.getPage(filePath);

      if (!page) {
        return res.status(404).render('error', {
          error: `Wiki page not found: ${pagePath} in project ${project}`
        });
      }

      res.render('wiki-page', {
        page,
        title: page.metadata?.title || pagePath,
        project
      });
    } catch (error) {
      console.error('Error rendering wiki page:', error);
      res.status(404).render('error', { error: error.message });
    }
  }

  /**
   * Validate GitHub URL format
   * @private
   */
  isValidGitHubUrl(url) {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubPattern.test(url);
  }

  /**
   * Get default state when none exists
   * @private
   */
  getDefaultState() {
    return {
      status: 'idle',
      currentCommit: 0,
      totalCommits: 0,
      repoUrl: null,
      filesProcessed: 0,
      pagesCreated: 0,
      pagesUpdated: 0
    };
  }
}

module.exports = DashboardController;
