const Processor = require('./processor');
const StateManager = require('./state-manager');
const WikiManager = require('./wiki-manager');
const WikiContextService = require('./wiki-context-service');
const WikiSearchService = require('./wiki-search-service');
const ActivityEventEmitter = require('./activity-event-emitter');
const PlanningManager = require('./planning-manager');
const SuggestionEngine = require('./suggestion-engine');
const WikiAnalytics = require('./wiki-analytics');
const ProjectManager = require('./project-manager');
const CommentsManager = require('./comments-manager');
const GitHistoryService = require('./git-history-service');
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

    // Initialize WikiContextService
    this.wikiContextService = new WikiContextService({ wikiBasePath: wikisBasePath });

    // Initialize WikiSearchService
    this.wikiSearchService = new WikiSearchService(wikisBasePath);

    // Initialize ActivityEventEmitter
    this.activityEmitter = new ActivityEventEmitter();

    // Initialize PlanningManager
    this.planningManager = new PlanningManager(wikisBasePath);

    // Initialize SuggestionEngine
    this.suggestionEngine = new SuggestionEngine(wikisBasePath);

    // Initialize WikiAnalytics
    this.wikiAnalytics = new WikiAnalytics(wikisBasePath);

    // Initialize ProjectManager
    this.projectManager = new ProjectManager(wikisBasePath);

    // Initialize CommentsManager
    this.commentsManager = new CommentsManager(wikisBasePath);

    // Initialize GitHistoryService
    this.gitHistoryService = new GitHistoryService(wikisBasePath);
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
      // Get all projects with full metadata
      const projectsWithMetadata = await this.projectManager.getAllProjects();

      res.json({
        projects: projectsWithMetadata,
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

      // Emit activity event for processing start
      this.activityEmitter.emitActivity('COMMIT_START', {
        commitSha: 'init',
        commitMessage: `Starting processing for ${repoUrl}`
      });

      // Start processing in background with error handling
      this.currentProcessing = this.processor.processRepository(repoUrl, {
        maxCost: maxCost || Infinity
      }).catch(error => {
        console.error('Background processing error:', error.message);
        this.activityEmitter.emitError(error, 'repository processing');
        this.currentProcessing = null;
      });

      res.json({
        message: 'Processing started',
        repoUrl,
        status: 'processing'
      });
    } catch (error) {
      console.error('Error starting processing:', error);
      this.activityEmitter.emitError(error, 'start processing');
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
   * POST /api/context/research - Research wiki content
   */
  async researchContext(req, res) {
    try {
      const { query, projectName } = req.body;

      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const project = projectName || this.defaultProject;

      // Perform research using WikiContextService
      const results = await this.wikiContextService.research(query, project);

      res.json({
        success: true,
        data: results,
        statistics: this.wikiContextService.getStatistics()
      });
    } catch (error) {
      console.error('Error researching context:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * GET /api/wiki/:project/search?q=query - Search wiki pages
   */
  async searchWiki(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const query = req.query.q;

      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const results = await this.wikiSearchService.searchWiki(query, project);

      res.json({
        success: true,
        query,
        results,
        count: results.length
      });
    } catch (error) {
      console.error('Error searching wiki:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * GET /api/wiki/:project/toc/:page(*) - Get table of contents for a page
   */
  async getTableOfContents(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const pagePath = req.params.page || req.params[0];

      if (!pagePath) {
        return res.status(400).json({ error: 'Page path is required' });
      }

      // Ensure page path has .md extension
      const filePath = pagePath.endsWith('.md') ? pagePath : `${pagePath}.md`;

      const toc = await this.wikiSearchService.getTableOfContents(filePath, project);

      res.json({
        success: true,
        pagePath: filePath,
        toc
      });
    } catch (error) {
      console.error('Error getting table of contents:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * GET /api/wiki/:project/related/:page(*) - Get related pages
   */
  async getRelatedPages(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const pagePath = req.params.page || req.params[0];

      if (!pagePath) {
        return res.status(400).json({ error: 'Page path is required' });
      }

      // Ensure page path has .md extension
      const filePath = pagePath.endsWith('.md') ? pagePath : `${pagePath}.md`;

      const relatedPages = await this.wikiSearchService.getRelatedPages(filePath, project);

      res.json({
        success: true,
        pagePath: filePath,
        relatedPages
      });
    } catch (error) {
      console.error('Error getting related pages:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * GET /wiki/:project/:page/edit - Get wiki page for editing
   */
  async getWikiForEdit(req, res) {
    try {
      const fullPath = req.path.startsWith('/') ? req.path.substring(1) : req.path;
      const pathParts = fullPath.split('/');
      const project = pathParts[0] || this.defaultProject;
      const pagePath = pathParts.slice(1, -1).join('/') || 'index';
      const filePath = pagePath.includes('.md') ? pagePath : `${pagePath}.md`;

      const wikiManager = this.getProjectWikiManager(project);
      const fullFilePath = path.join(wikiManager.wikiPath, filePath);

      const rawContent = await fs.readFile(fullFilePath, 'utf-8');
      const { metadata, content } = this._parseFrontmatter(rawContent);

      res.render('wiki-editor', {
        project,
        pagePath: filePath,
        metadata,
        content,
        title: metadata.title || pagePath
      });
    } catch (error) {
      console.error('Error loading wiki for edit:', error);
      res.status(404).render('error', { error: error.message });
    }
  }

  /**
   * POST /wiki/:project/:page/save - Save edited wiki page
   */
  async saveWikiEdit(req, res) {
    try {
      const fullPath = req.path.startsWith('/') ? req.path.substring(1) : req.path;
      const pathParts = fullPath.split('/');
      const project = pathParts[0] || this.defaultProject;
      const pagePath = pathParts.slice(1, -1).join('/') || 'index';
      const filePath = pagePath.includes('.md') ? pagePath : `${pagePath}.md`;

      const { content, metadata } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const wikiManager = this.getProjectWikiManager(project);
      const fullFilePath = path.join(wikiManager.wikiPath, filePath);

      await fs.mkdir(path.dirname(fullFilePath), { recursive: true });

      const backupPath = `${fullFilePath}.backup`;
      try {
        await fs.copyFile(fullFilePath, backupPath);
      } catch (err) {
        console.warn('Could not create backup:', err.message);
      }

      const parsedMetadata = {
        title: metadata.title || 'Untitled',
        category: metadata.category || 'general',
        tags: metadata.tags || [],
        updated: new Date().toISOString().split('T')[0]
      };

      if (metadata.created) {
        parsedMetadata.created = metadata.created;
      }

      await wikiManager.updatePage(filePath, content, parsedMetadata);

      res.json({
        success: true,
        message: 'Page saved successfully',
        updated: parsedMetadata.updated
      });
    } catch (error) {
      console.error('Error saving wiki page:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /wiki/:project/create - Create new wiki page
   */
  async createWikiPage(req, res) {
    try {
      const fullPath = req.path.startsWith('/') ? req.path.substring(1) : req.path;
      const pathParts = fullPath.split('/');
      const project = pathParts[0] || this.defaultProject;

      const { pagePath, content, metadata } = req.body;

      if (!pagePath || !content) {
        return res.status(400).json({ error: 'Page path and content are required' });
      }

      const filePath = pagePath.includes('.md') ? pagePath : `${pagePath}.md`;
      const wikiManager = this.getProjectWikiManager(project);

      const parsedMetadata = {
        title: metadata?.title || 'Untitled',
        category: metadata?.category || 'general',
        tags: metadata?.tags || [],
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0]
      };

      await wikiManager.createPage(filePath, content, parsedMetadata);

      res.json({
        success: true,
        message: 'Page created successfully',
        path: filePath
      });
    } catch (error) {
      console.error('Error creating wiki page:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Parse frontmatter from markdown content
   * @private
   */
  _parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { metadata: {}, content };
    }

    const [, frontmatterText, pageContent] = match;
    const metadata = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();

        if (value.startsWith('[') && value.endsWith(']')) {
          const items = value.slice(1, -1).split(',').map(s => s.trim());
          metadata[key] = items;
        } else {
          metadata[key] = value;
        }
      }
    }

    return { metadata, content: pageContent };
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

  /**
   * GET /api/planning/:project - Get planning tasks
   */
  async getPlanningTasks(req, res) {
    try {
      const project = req.params.project || this.defaultProject;

      const tasks = await this.planningManager.getTasks(project);
      const statistics = await this.planningManager.getStatistics(project);

      res.json({
        success: true,
        project,
        tasks,
        statistics
      });
    } catch (error) {
      console.error('Error getting planning tasks:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * POST /api/planning/:project/tasks - Create planning task
   */
  async createPlanningTask(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const taskData = req.body;

      if (!taskData.title) {
        return res.status(400).json({
          error: 'Task title is required',
          success: false
        });
      }

      const task = await this.planningManager.createTask(project, taskData);

      res.json({
        success: true,
        task
      });
    } catch (error) {
      console.error('Error creating planning task:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * PUT /api/planning/:project/tasks/:id - Update planning task
   */
  async updatePlanningTask(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const taskId = req.params.id;
      const updates = req.body;

      const task = await this.planningManager.updateTask(project, taskId, updates);

      res.json({
        success: true,
        task
      });
    } catch (error) {
      console.error('Error updating planning task:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * DELETE /api/planning/:project/tasks/:id - Delete planning task
   */
  async deletePlanningTask(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const taskId = req.params.id;

      await this.planningManager.deleteTask(project, taskId);

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting planning task:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * GET /planning - Render planning view
   */
  async renderPlanning(req, res) {
    try {
      const projects = await this.getAvailableProjects();

      res.render('planning', {
        version: '1.0.0',
        projects,
        defaultProject: this.defaultProject
      });
    } catch (error) {
      console.error('Error rendering planning:', error);
      res.status(500).render('error', { error: error.message });
    }
  }

  /**
   * GET /api/activity/feed - Server-Sent Events endpoint for activity feed
   */
  getActivityFeed(req, res) {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send initial comment to establish connection
    res.write(': connected\n\n');

    // Send existing history
    const history = this.activityEmitter.getHistory(10);
    if (history.length > 0) {
      res.write(`event: history\ndata: ${JSON.stringify(history)}\n\n`);
    }

    // Listen for new events
    const listener = (event) => {
      res.write(`event: activity\ndata: ${JSON.stringify(event)}\n\n`);
    };

    this.activityEmitter.on('activity', listener);

    // Send keepalive ping every 30 seconds
    const keepaliveInterval = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 30000);

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(keepaliveInterval);
      this.activityEmitter.removeListener('activity', listener);
    });
  }

  /**
   * GET /api/activity/history - Get activity history
   */
  async getActivityHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const history = this.activityEmitter.getHistory(limit);
      const stats = this.activityEmitter.getStatistics();

      res.json({
        success: true,
        events: history,
        statistics: stats
      });
    } catch (error) {
      console.error('Error getting activity history:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * POST /api/activity/clear - Clear activity history
   */
  async clearActivityHistory(req, res) {
    try {
      this.activityEmitter.clearHistory();

      res.json({
        success: true,
        message: 'Activity history cleared'
      });
    } catch (error) {
      console.error('Error clearing activity history:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * GET /api/suggestions/:project - Get suggestions for a project
   */
  async getSuggestions(req, res) {
    try {
      const project = req.params.project || this.defaultProject;

      const result = await this.suggestionEngine.getSuggestions(project);

      res.json({
        success: true,
        project,
        suggestions: result.suggestions,
        statistics: result.statistics
      });
    } catch (error) {
      console.error('Error getting suggestions:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * POST /api/suggestions/:project/generate - Generate suggestions for a project
   */
  async generateSuggestions(req, res) {
    try {
      const project = req.params.project || this.defaultProject;

      const result = await this.suggestionEngine.generateSuggestions(project);

      res.json({
        success: true,
        project,
        suggestions: result.suggestions,
        statistics: result.statistics,
        message: `Generated ${result.suggestions.length} suggestions`
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * POST /api/suggestions/:project/:id/apply - Apply a suggestion
   */
  async applySuggestion(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const suggestionId = req.params.id;

      const suggestion = await this.suggestionEngine.applySuggestion(project, suggestionId);

      res.json({
        success: true,
        suggestion,
        message: 'Suggestion applied'
      });
    } catch (error) {
      console.error('Error applying suggestion:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * DELETE /api/suggestions/:project/:id - Dismiss a suggestion
   */
  async dismissSuggestion(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const suggestionId = req.params.id;

      const suggestion = await this.suggestionEngine.dismissSuggestion(project, suggestionId);

      res.json({
        success: true,
        suggestion,
        message: 'Suggestion dismissed'
      });
    } catch (error) {
      console.error('Error dismissing suggestion:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * GET /api/analytics/:project - Get wiki analytics data
   */
  async getWikiAnalytics(req, res) {
    try {
      const project = req.params.project || this.defaultProject;

      const analytics = await this.wikiAnalytics.analyzeWiki(project);

      res.json({
        success: true,
        project,
        analytics
      });
    } catch (error) {
      console.error('Error getting wiki analytics:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * GET /analytics - Render analytics dashboard
   */
  async renderAnalyticsDashboard(req, res) {
    try {
      const projects = await this.getAvailableProjects();

      res.render('analytics', {
        version: '1.0.0',
        projects,
        defaultProject: this.defaultProject
      });
    } catch (error) {
      console.error('Error rendering analytics dashboard:', error);
      res.status(500).render('error', { error: error.message });
    }
  }

  /**
   * GET /projects - Render projects management view
   */
  async renderProjectsView(req, res) {
    try {
      const projects = await this.projectManager.getAllProjects();

      res.render('projects', {
        version: '1.0.0',
        projects,
        defaultProject: this.defaultProject
      });
    } catch (error) {
      console.error('Error rendering projects view:', error);
      res.status(500).render('error', { error: error.message });
    }
  }

  /**
   * POST /api/projects/create - Create new project
   */
  async createProject(req, res) {
    try {
      const { name, description, repository, theme, maxPageSize } = req.body;

      if (!name) {
        return res.status(400).json({
          error: 'Project name is required',
          success: false
        });
      }

      const metadata = {
        name,
        description,
        repository,
        theme,
        maxPageSize
      };

      const project = await this.projectManager.createProject(name, metadata);

      res.json({
        success: true,
        project,
        message: `Project "${project.name}" created successfully`
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * POST /api/projects/import - Import existing project
   */
  async importProject(req, res) {
    try {
      const { sourcePath, name } = req.body;

      if (!sourcePath || !name) {
        return res.status(400).json({
          error: 'Source path and project name are required',
          success: false
        });
      }

      const project = await this.projectManager.importProject(sourcePath, name);

      res.json({
        success: true,
        project,
        message: `Project "${project.name}" imported successfully`
      });
    } catch (error) {
      console.error('Error importing project:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * DELETE /api/projects/:project - Delete project
   */
  async deleteProject(req, res) {
    try {
      const projectName = req.params.project;

      if (!projectName) {
        return res.status(400).json({
          error: 'Project name is required',
          success: false
        });
      }

      // Prevent deleting the default project
      if (projectName === this.defaultProject) {
        return res.status(400).json({
          error: 'Cannot delete the default project',
          success: false
        });
      }

      await this.projectManager.deleteProject(projectName);

      res.json({
        success: true,
        message: `Project "${projectName}" deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting project:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * GET /api/projects/:project/settings - Get project settings
   */
  async getProjectSettings(req, res) {
    try {
      const projectName = req.params.project;

      if (!projectName) {
        return res.status(400).json({
          error: 'Project name is required',
          success: false
        });
      }

      const settings = await this.projectManager.getProjectSettings(projectName);

      res.json({
        success: true,
        project: projectName,
        settings
      });
    } catch (error) {
      console.error('Error getting project settings:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * PUT /api/projects/:project/settings - Update project settings
   */
  async updateProjectSettings(req, res) {
    try {
      const projectName = req.params.project;
      const settings = req.body;

      if (!projectName) {
        return res.status(400).json({
          error: 'Project name is required',
          success: false
        });
      }

      const updatedSettings = await this.projectManager.updateProjectSettings(projectName, settings);

      res.json({
        success: true,
        project: projectName,
        settings: updatedSettings,
        message: 'Settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating project settings:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * GET /api/comments/:project/:page - Get comments for a page
   */
  async getPageComments(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const pageId = req.params.page;

      if (!pageId) {
        return res.status(400).json({
          error: 'Page ID is required',
          success: false
        });
      }

      const comments = await this.commentsManager.getComments(project, pageId);

      res.json({
        success: true,
        project,
        pageId,
        comments,
        count: comments.length
      });
    } catch (error) {
      console.error('Error getting page comments:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * POST /api/comments/:project/:page - Add comment to a page
   */
  async addComment(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const pageId = req.params.page;
      const { author, content } = req.body;

      if (!pageId) {
        return res.status(400).json({
          error: 'Page ID is required',
          success: false
        });
      }

      if (!content || content.trim() === '') {
        return res.status(400).json({
          error: 'Comment content is required',
          success: false
        });
      }

      const comment = await this.commentsManager.addComment(project, pageId, {
        author: author || 'Anonymous',
        content: content.trim()
      });

      res.json({
        success: true,
        comment,
        message: 'Comment added successfully'
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * PUT /api/comments/:project/:commentId - Update a comment
   */
  async updateComment(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const commentId = req.params.commentId;
      const updates = req.body;

      if (!commentId) {
        return res.status(400).json({
          error: 'Comment ID is required',
          success: false
        });
      }

      const comment = await this.commentsManager.updateComment(project, commentId, updates);

      res.json({
        success: true,
        comment,
        message: 'Comment updated successfully'
      });
    } catch (error) {
      console.error('Error updating comment:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * DELETE /api/comments/:project/:commentId - Delete a comment
   */
  async deleteComment(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const commentId = req.params.commentId;

      if (!commentId) {
        return res.status(400).json({
          error: 'Comment ID is required',
          success: false
        });
      }

      await this.commentsManager.deleteComment(project, commentId);

      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting comment:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * POST /api/comments/:project/:commentId/resolve - Toggle comment resolved status
   */
  async resolveComment(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const commentId = req.params.commentId;

      if (!commentId) {
        return res.status(400).json({
          error: 'Comment ID is required',
          success: false
        });
      }

      const comment = await this.commentsManager.resolveComment(project, commentId);

      res.json({
        success: true,
        comment,
        message: comment.resolved ? 'Comment marked as resolved' : 'Comment marked as unresolved'
      });
    } catch (error) {
      console.error('Error resolving comment:', error);

      if (error.message.includes('not found')) {
        res.status(404).json({
          error: error.message,
          success: false
        });
      } else {
        res.status(500).json({
          error: error.message,
          success: false
        });
      }
    }
  }

  /**
   * GET /api/history/:project/:page(*) - Get git history for a wiki page
   */
  async getPageHistory(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const pagePath = req.params.page || req.params[0];

      if (!pagePath) {
        return res.status(400).json({
          error: 'Page path is required',
          success: false
        });
      }

      // Ensure page path has .md extension
      const filePath = pagePath.endsWith('.md') ? pagePath : `${pagePath}.md`;

      // Check if project has git repository
      const hasGit = await this.gitHistoryService.hasGitRepo(project);
      if (!hasGit) {
        return res.json({
          success: true,
          hasGit: false,
          message: 'No git repository found for this project',
          commits: []
        });
      }

      // Get commit history
      const commits = await this.gitHistoryService.getPageHistory(filePath, project);

      res.json({
        success: true,
        hasGit: true,
        project,
        pagePath: filePath,
        commits,
        count: commits.length
      });
    } catch (error) {
      console.error('Error getting page history:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * GET /api/history/commit/:project/:sha - Get details for a specific commit
   */
  async getCommitDetails(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const sha = req.params.sha;

      if (!sha) {
        return res.status(400).json({
          error: 'Commit SHA is required',
          success: false
        });
      }

      const commit = await this.gitHistoryService.getCommitDetails(sha, project);

      res.json({
        success: true,
        project,
        commit
      });
    } catch (error) {
      console.error('Error getting commit details:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }

  /**
   * GET /api/history/:project/:page(*)/statistics - Get statistics for a wiki page
   */
  async getPageStatistics(req, res) {
    try {
      const project = req.params.project || this.defaultProject;
      const pagePath = req.params.page || req.params[0];

      if (!pagePath) {
        return res.status(400).json({
          error: 'Page path is required',
          success: false
        });
      }

      // Ensure page path has .md extension
      const filePath = pagePath.endsWith('.md') ? pagePath : `${pagePath}.md`;

      // Check if project has git repository
      const hasGit = await this.gitHistoryService.hasGitRepo(project);
      if (!hasGit) {
        return res.json({
          success: true,
          hasGit: false,
          message: 'No git repository found for this project'
        });
      }

      const statistics = await this.gitHistoryService.getPageStatistics(filePath, project);

      res.json({
        success: true,
        hasGit: true,
        project,
        pagePath: filePath,
        statistics
      });
    } catch (error) {
      console.error('Error getting page statistics:', error);
      res.status(500).json({
        error: error.message,
        success: false
      });
    }
  }
}

module.exports = DashboardController;
