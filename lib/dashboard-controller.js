const Processor = require('./processor');
const StateManager = require('./state-manager');
const WikiManager = require('./wiki-manager');

/**
 * DashboardController handles HTTP requests for wiki generation control
 */
class DashboardController {
  constructor() {
    this.processor = new Processor('./wiki');
    this.stateManager = new StateManager();
    this.wikiManager = new WikiManager('./wiki');
    this.currentProcessing = null;
  }

  /**
   * GET / - Render dashboard view
   */
  async renderDashboard(req, res) {
    try {
      const state = await this.stateManager.loadState();
      res.render('dashboard', {
        state: state || this.getDefaultState(),
        version: '1.0.0'
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
   */
  async renderWikiPage(req, res) {
    try {
      // Extract page path from request path (relative to /wiki mount point)
      // Remove leading slash if present
      const pagePath = req.path.startsWith('/') ? req.path.substring(1) : req.path;

      // Convert URL path to file path
      // e.g., "concepts/architecture" -> "concepts/architecture.md"
      const filePath = pagePath.includes('.md') ? pagePath : `${pagePath}.md`;

      const page = await this.wikiManager.getPage(filePath);

      if (!page) {
        return res.status(404).render('error', {
          error: `Wiki page not found: ${pagePath}`
        });
      }

      res.render('wiki-page', {
        page,
        title: page.metadata?.title || pagePath
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
