const WikiManager = require('./wiki-manager');
const StateManager = require('./state-manager');
const GitHubClient = require('./github');
const CodeAnalysisAgent = require('./agents/code-analysis-agent');
const DocumentationWriterAgent = require('./agents/documentation-writer-agent');
const MetaAnalysisAgent = require('./agents/meta-analysis-agent');
const WikiIndexAgent = require('./agents/wiki-index-agent');
const GuideGenerationAgent = require('./agents/guide-generation-agent');
const ArchitectureOverviewAgent = require('./agents/architecture-overview-agent');
const ClaudeClient = require('./claude');

/**
 * Processor handles the main processing logic for analyzing commits
 * and generating/updating documentation
 */
class Processor {
  constructor(wikiPath = './dev-wiki') {
    this.wikiManager = new WikiManager(wikiPath);
    this.stateManager = new StateManager();
    this.githubClient = new GitHubClient();
    this.codeAnalysisAgent = new CodeAnalysisAgent();
    this.documentationWriterAgent = new DocumentationWriterAgent();
    this.metaAnalysisAgent = new MetaAnalysisAgent();
    this.wikiIndexAgent = new WikiIndexAgent();
    this.guideGenerationAgent = new GuideGenerationAgent();
    this.architectureOverviewAgent = new ArchitectureOverviewAgent();
    this.claudeClient = new ClaudeClient(); // For cost tracking
  }

  /**
   * Process a single commit
   * @param {Object} commit - Commit object with sha, message, and files
   * @param {Object} state - Current processing state
   * @returns {Object} Processing summary
   */
  async processCommit(commit, state) {
    const summary = {
      commitSha: commit.sha,
      filesProcessed: 0,
      filesSkipped: 0,
      pagesCreated: 0,
      pagesUpdated: 0,
      concepts: []
    };

    // Process each file in the commit
    for (const file of commit.files) {
      // Skip files without patches (e.g., deletions, binary files)
      if (!file.patch) {
        summary.filesSkipped++;
        continue;
      }

      // Check if file is significant
      if (!this.isSignificantFile(file.filename)) {
        summary.filesSkipped++;
        continue;
      }

      // Get relevant wiki context
      const relatedPages = this.getRelevantContext(file.filename);

      // Analyze the code change
      const analysis = await this.codeAnalysisAgent.analyzeCode(
        file.filename,
        file.patch,
        commit.message,
        relatedPages
      );

      // Track concepts
      summary.concepts.push(...analysis.concepts);

      // Generate/update documentation for each concept
      for (const concept of analysis.concepts) {
        await this.processConceptDocumentation(concept, analysis, summary);
      }

      summary.filesProcessed++;
    }

    return summary;
  }

  /**
   * Process documentation for a single concept
   * @param {Object|string} concept - Concept object or name (for backward compatibility)
   * @param {Object} analysis - Code analysis result
   * @param {Object} summary - Processing summary to update
   */
  async processConceptDocumentation(concept, analysis, summary) {
    // Handle both object and string formats
    const conceptName = typeof concept === 'string' ? concept : concept.name;
    const conceptCategory = typeof concept === 'string' ? 'components' : (concept.category || 'components');

    const pagePath = this.determinePagePath(concept);

    // Check if page already exists
    const existingPage = await this.wikiManager.getPage(pagePath);

    if (existingPage) {
      // Update existing documentation
      const updatedContent = await this.documentationWriterAgent.writeDocumentation(
        conceptName,
        analysis,
        existingPage.content
      );

      await this.wikiManager.updatePage(
        pagePath,
        updatedContent,
        {
          title: conceptName,
          category: conceptCategory
        }
      );

      // Update global metadata
      await this.wikiManager.updatePageGlobalMetadata(pagePath, {
        title: conceptName,
        category: conceptCategory,
        incomingLinks: [], // Will be populated in future enhancement
        outgoingLinks: []  // Will be populated in future enhancement
      });

      summary.pagesUpdated++;
    } else {
      // Create new documentation
      const newContent = await this.documentationWriterAgent.writeDocumentation(
        conceptName,
        analysis,
        '' // No existing content
      );

      await this.wikiManager.createPage(
        pagePath,
        newContent,
        {
          title: conceptName,
          category: conceptCategory,
          related: []
        }
      );

      // Add to global metadata
      await this.wikiManager.updatePageGlobalMetadata(pagePath, {
        title: conceptName,
        created: new Date().toISOString().split('T')[0],
        category: conceptCategory,
        incomingLinks: [],
        outgoingLinks: []
      });

      summary.pagesCreated++;
    }
  }

  /**
   * Determine if a file is significant enough to document
   * @param {string} filePath - Path to the file
   * @returns {boolean} Whether file is significant
   */
  isSignificantFile(filePath) {
    // Delegate to CodeAnalysisAgent which already has this logic
    return this.codeAnalysisAgent.isSignificantFile(filePath);
  }

  /**
   * Get relevant wiki context for a file
   * Returns up to 3 related pages
   * @param {string} filePath - Path to the file
   * @returns {string[]} Array of related page paths (max 3)
   */
  getRelevantContext(filePath) {
    // Extract potential keywords from file path
    // e.g., 'src/auth/service.js' -> 'auth', 'service'
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const keywords = fileName.replace(/\.(js|ts|py|java|go)$/, '');

    // Search for related pages
    const relatedPages = this.wikiManager.getRelatedPages(keywords);

    // Handle undefined or non-array return values
    if (!Array.isArray(relatedPages)) {
      return [];
    }

    // Return up to 3 pages
    return relatedPages.slice(0, 3);
  }

  /**
   * Determine the wiki page path for a concept
   * Routes to appropriate directory based on category
   * @param {Object|string} concept - Concept object with category, or legacy string
   * @returns {string} Page path (with .md extension)
   */
  determinePagePath(concept) {
    // Handle legacy format (string)
    let conceptName, category;
    if (typeof concept === 'string') {
      conceptName = concept;
      category = 'components'; // Default for backward compatibility
    } else {
      conceptName = concept.name;
      category = concept.category || 'components';
    }

    // Convert to kebab-case
    // 'AuthService' -> 'auth-service'
    // 'UserAuthenticationManager' -> 'user-authentication-manager'
    // 'Session Manager' -> 'session-manager'
    const kebab = conceptName
      .replace(/([a-z])([A-Z])/g, '$1-$2') // CamelCase to kebab
      .replace(/\s+/g, '-') // Spaces to dashes
      .toLowerCase();

    // Map category to directory
    // 'concept' -> 'concepts/'
    // 'component' -> 'components/'
    // 'guide' -> 'guides/'
    const directory = category === 'concept' ? 'concepts' :
                     category === 'guide' ? 'guides' :
                     'components';

    return `${directory}/${kebab}.md`;
  }

  /**
   * Process an entire repository
   * @param {string} repoUrl - GitHub repository URL
   * @param {Object} options - Processing options
   * @param {number} options.maxCost - Maximum cost limit (optional)
   * @param {number} options.metaAnalysisFrequency - Run meta-analysis every N commits (default: 5)
   * @returns {Object} Processing summary
   */
  async processRepository(repoUrl, options = {}) {
    const {
      maxCost = Infinity,
      metaAnalysisFrequency = 5
    } = options;

    // Load or initialize state
    const state = await this.stateManager.loadState();

    // Parse repository URL
    const repoInfo = this.githubClient.parseRepoUrl(repoUrl);

    // Fetch all commits
    const allCommits = await this.githubClient.getCommits(repoInfo.owner, repoInfo.repo);

    // Initialize processing statistics
    const stats = {
      commitsProcessed: 0,
      totalFiles: 0,
      filesProcessed: 0,
      filesSkipped: 0,
      pagesCreated: 0,
      pagesUpdated: 0,
      metaAnalysisRuns: 0,
      stopped: false,
      stopReason: null,
      allConcepts: [],
      allPages: []
    };

    // Determine starting point (resume from state if exists)
    let startIndex = 0;
    if (state.repoUrl === repoUrl && state.currentCommit > 0) {
      startIndex = state.currentCommit;
    } else {
      // Starting fresh - initialize state
      state.repoUrl = repoUrl;
      state.totalCommits = allCommits.length;
      state.currentCommit = 0;
      state.lastMetaAnalysis = 0;
      state.status = 'running';
    }

    // Process each commit
    for (let i = startIndex; i < allCommits.length; i++) {
      const commit = allCommits[i];

      // Check cost limit before processing
      const costSummary = this.claudeClient.getCostSummary();
      if (costSummary.totalCost >= maxCost) {
        stats.stopped = true;
        stats.stopReason = 'cost_limit';
        state.status = 'paused';
        await this.stateManager.saveState(state);
        break;
      }

      // Process the commit
      const commitSummary = await this.processCommit(commit, state);

      // Update statistics
      stats.commitsProcessed++;
      stats.totalFiles += (commit.files || []).length;
      stats.filesProcessed += commitSummary.filesProcessed;
      stats.filesSkipped += commitSummary.filesSkipped;
      stats.pagesCreated += commitSummary.pagesCreated;
      stats.pagesUpdated += commitSummary.pagesUpdated;
      stats.allConcepts.push(...commitSummary.concepts);

      // Update state
      state.currentCommit = i + 1;
      await this.stateManager.saveState(state);

      // Check if we should run meta-analysis
      if (this.metaAnalysisAgent.shouldRunMetaAnalysis(state.currentCommit, state.lastMetaAnalysis || 0)) {
        const analysis = await this.metaAnalysisAgent.analyzeProgress(
          stats.allConcepts,
          stats.allPages
        );

        stats.metaAnalysisRuns++;
        state.lastMetaAnalysis = state.currentCommit;

        // Store meta-analysis results (could be used for recommendations)
        state.lastMetaAnalysisResults = analysis;

        await this.stateManager.saveState(state);
      }
    }

    // Mark as stopped if we processed all commits
    if (!stats.stopped && state.currentCommit >= allCommits.length) {
      state.status = 'stopped';
      await this.stateManager.saveState(state);
    }

    // Generate architecture overview, guides, and index if processing completed successfully
    if (!stats.stopped || stats.stopReason !== 'cost_limit') {
      await this.generateArchitectureOverview(repoInfo);
      await this.generateWikiGuides(repoInfo);
      await this.generateWikiIndex(repoInfo);
    }

    // Add cost summary to stats
    const finalCostSummary = this.claudeClient.getCostSummary();
    stats.totalCost = finalCostSummary.totalCost;

    return stats;
  }

  /**
   * Generate architecture overview page
   * @param {Object} repoInfo - Repository information
   */
  async generateArchitectureOverview(repoInfo) {
    try {
      // Get all wiki pages
      const allPages = await this.wikiManager.getAllPages();

      // Extract repository name from repoInfo
      const repositoryName = repoInfo.repo || 'Repository';

      // Separate pages by category
      const wikiData = {
        repositoryName,
        concepts: allPages.filter(p =>
          p.metadata.category === 'concept' ||
          p.metadata.category === 'concepts'
        ).map(p => ({
          title: p.metadata.title || p.path,
          content: p.content || ''
        })),
        components: allPages.filter(p =>
          p.metadata.category === 'component' ||
          p.metadata.category === 'components'
        ).map(p => ({
          title: p.metadata.title || p.path,
          content: p.content || ''
        })),
        guides: allPages.filter(p =>
          p.metadata.category === 'guide' ||
          p.metadata.category === 'guides'
        ).map(p => ({
          title: p.metadata.title || p.path,
          content: p.content || ''
        }))
      };

      // Generate architecture overview
      const overviewContent = await this.architectureOverviewAgent.generateArchitectureOverview(wikiData);

      // Write to concepts/architecture.md
      const fs = require('fs').promises;
      const path = require('path');
      const archPath = path.join(this.wikiManager.wikiPath, 'concepts/architecture.md');
      await fs.writeFile(archPath, overviewContent, 'utf-8');

    } catch (error) {
      // Log error but don't fail the entire process
      console.warn('Warning: Failed to generate architecture overview:', error.message);
    }
  }

  /**
   * Generate operational guides for the wiki
   * @param {Object} repoInfo - Repository information
   */
  async generateWikiGuides(repoInfo) {
    try {
      // Get all wiki pages
      const allPages = await this.wikiManager.getAllPages();

      // Extract repository name from repoInfo
      const repositoryName = repoInfo.repo || 'Repository';

      // Separate pages by category
      const components = allPages.filter(p =>
        (p.metadata.category || 'component') === 'component' ||
        (p.metadata.category || 'component') === 'components'
      );

      const concepts = allPages.filter(p =>
        (p.metadata.category || '') === 'concept' ||
        (p.metadata.category || '') === 'concepts'
      );

      // Detect repository information from file structure
      const fs = require('fs').promises;
      const path = require('path');
      const files = [];

      // Scan repository for file types
      const scanDir = async (dir) => {
        try {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
              await scanDir(fullPath);
            } else if (entry.isFile()) {
              files.push(fullPath);
            }
          }
        } catch (error) {
          // Ignore errors (permission denied, etc.)
        }
      };

      // Scan from current directory (repository root)
      await scanDir('.');

      const repositoryInfo = this.guideGenerationAgent.detectRepositoryInfo({ files });

      // Prepare data for guide generation
      const wikiData = {
        repositoryName,
        components: components.map(p => ({
          title: p.metadata.title || p.path,
          content: p.content || ''
        })),
        concepts: concepts.map(p => ({
          title: p.metadata.title || p.path,
          content: p.content || ''
        })),
        repositoryInfo
      };

      // Generate guides
      const result = await this.guideGenerationAgent.generateGuides(wikiData);

      // Write each guide to guides/ directory
      for (const guide of result.guides) {
        const guidePath = this.determinePagePath({
          name: guide.title,
          category: 'guide'
        });

        const fullPath = path.join(this.wikiManager.wikiPath, guidePath);
        await fs.writeFile(fullPath, guide.content, 'utf-8');
      }

    } catch (error) {
      // Log error but don't fail the entire process
      console.warn('Warning: Failed to generate wiki guides:', error.message);
    }
  }

  /**
   * Generate wiki index page
   * @param {Object} repoInfo - Repository information
   */
  async generateWikiIndex(repoInfo) {
    try {
      // Get all wiki pages
      const allPages = await this.wikiManager.getAllPages();

      // Extract repository name from repoInfo
      const repositoryName = repoInfo.repo || 'Repository';

      // Prepare data for index generation
      const wikiData = {
        repositoryName,
        pages: allPages.map(p => ({
          title: p.metadata.title || p.path,
          path: p.path,
          category: p.metadata.category || 'component'
        }))
      };

      // Generate index content
      const indexContent = await this.wikiIndexAgent.generateIndex(wikiData);

      // Write index.md to wiki root
      const indexPath = 'index.md';
      const fullPath = require('path').join(this.wikiManager.wikiPath, indexPath);
      const fs = require('fs').promises;
      await fs.writeFile(fullPath, indexContent, 'utf-8');

    } catch (error) {
      // Log error but don't fail the entire process
      console.warn('Warning: Failed to generate wiki index:', error.message);
    }
  }
}

module.exports = Processor;
