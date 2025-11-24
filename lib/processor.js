const WikiManager = require('./wiki-manager');
const StateManager = require('./state-manager');
const GitHubClient = require('./github');
const CodeAnalysisAgent = require('./agents/code-analysis-agent');
const DocumentationWriterAgent = require('./agents/documentation-writer-agent');
const MetaAnalysisAgent = require('./agents/meta-analysis-agent');
const MetaDocumentIngestionAgent = require('./agents/meta-document-ingestion-agent');
const WikiIndexAgent = require('./agents/wiki-index-agent');
const GuideGenerationAgent = require('./agents/guide-generation-agent');
const ArchitectureOverviewAgent = require('./agents/architecture-overview-agent');
const TestCoverageAnalyzer = require('./test-coverage-analyzer');
const ClaudeClient = require('./claude');
const config = require('./config');

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
    this.metaDocumentIngestionAgent = new MetaDocumentIngestionAgent();
    this.wikiIndexAgent = new WikiIndexAgent();
    this.guideGenerationAgent = new GuideGenerationAgent();
    this.architectureOverviewAgent = new ArchitectureOverviewAgent();
    this.testCoverageAnalyzer = new TestCoverageAnalyzer();
    this.claudeClient = new ClaudeClient(); // For cost tracking
  }

  /**
   * Process a single commit
   * @param {Object} commit - Commit object with sha, message, and files
   * @param {Object} state - Current processing state
   * @returns {Object} Processing summary
   *
   * ACTIVITY FEED INTEGRATION:
   * To emit activity events, inject an activityEmitter instance and emit at these points:
   *
   * 1. Start of commit processing:
   *    this.activityEmitter?.emitCommitStart(commit.sha, commit.message);
   *
   * 2. During file analysis (in the loop):
   *    this.activityEmitter?.emitFileAnalysis(file.filename, 'processing');
   *    this.activityEmitter?.emitFileAnalysis(file.filename, 'completed');
   *    this.activityEmitter?.emitFileAnalysis(file.filename, 'skipped');
   *
   * 3. During wiki updates (in processConceptDocumentation):
   *    this.activityEmitter?.emitWikiUpdate(pagePath, 'created');
   *    this.activityEmitter?.emitWikiUpdate(pagePath, 'updated');
   *
   * 4. On errors (in catch blocks):
   *    this.activityEmitter?.emitError(error, 'commit processing');
   *
   * 5. After completion:
   *    this.activityEmitter?.emitCompletion(summary);
   */
  async processCommit(commit, state) {
    const summary = {
      commitSha: commit.sha,
      filesProcessed: 0,
      filesSkipped: 0,
      pagesCreated: 0,
      pagesUpdated: 0,
      metaDocumentsProcessed: 0,
      concepts: [],
      qualityIssues: 0,
      securityFindings: 0
    };

    // EXAMPLE: Emit commit start event
    // this.activityEmitter?.emitCommitStart(commit.sha, commit.message);

    // Separate files by type for parallel processing
    const metaDocuments = [];
    const codeFiles = [];

    for (const file of commit.files) {
      // Skip files without patches (e.g., deletions, binary files)
      if (!file.patch) {
        summary.filesSkipped++;
        continue;
      }

      // Check if file is a meta-document
      const metaInfo = this.isMetaDocument(file.filename);
      if (metaInfo) {
        metaDocuments.push({ file, metaInfo });
        continue;
      }

      // Check if file is significant code
      if (this.isSignificantFile(file.filename)) {
        codeFiles.push(file);
      } else {
        summary.filesSkipped++;
      }
    }

    // Process meta-documents in parallel
    const metaResults = await Promise.all(
      metaDocuments.map(({ file, metaInfo }) =>
        this.processMetaDocument(
          file.filename,
          metaInfo.category,
          metaInfo.documentType,
          metaInfo.title
        ).then(() => ({ type: 'meta', success: true }))
         .catch(err => ({ type: 'meta', success: false, error: err }))
      )
    );

    // Count successful meta-document processing
    summary.metaDocumentsProcessed = metaResults.filter(r => r.success).length;

    // Process code files in parallel
    const fileResults = await Promise.all(
      codeFiles.map(file => this.processCodeFile(file, commit))
    );

    // Aggregate results from parallel processing
    for (const result of fileResults) {
      if (result.success) {
        summary.filesProcessed++;
        summary.concepts.push(...result.concepts);
        summary.pagesCreated += result.pagesCreated;
        summary.pagesUpdated += result.pagesUpdated;
      } else {
        console.warn(`Failed to process ${result.filename}:`, result.error);
        summary.filesSkipped++;
      }
    }

    return summary;
  }

  /**
   * Process a single code file (designed for parallel execution)
   * @param {Object} file - File object with filename and patch
   * @param {Object} commit - Commit information
   * @returns {Promise<Object>} Processing result
   */
  async processCodeFile(file, commit) {
    try {
      // Get relevant wiki context
      const relatedPages = this.getRelevantContext(file.filename);

      // Analyze the code change
      const analysis = await this.codeAnalysisAgent.analyzeCode(
        file.filename,
        file.patch,
        commit.message,
        relatedPages
      );

      // Track pages created/updated during concept processing
      let pagesCreated = 0;
      let pagesUpdated = 0;

      // Generate/update documentation for each concept
      for (const concept of analysis.concepts) {
        const conceptSummary = {
          pagesCreated: 0,
          pagesUpdated: 0
        };
        await this.processConceptDocumentation(concept, analysis, conceptSummary);
        pagesCreated += conceptSummary.pagesCreated;
        pagesUpdated += conceptSummary.pagesUpdated;
      }

      return {
        success: true,
        filename: file.filename,
        concepts: analysis.concepts,
        pagesCreated,
        pagesUpdated
      };
    } catch (error) {
      return {
        success: false,
        filename: file.filename,
        error: error.message
      };
    }
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

    // Extract file path from analysis or concept
    const filePath = (typeof concept === 'object' && concept.sourceFile)
      ? concept.sourceFile
      : (analysis.filePath || 'Not specified');

    // Extract code examples from test files
    const codeExamples = await this.extractCodeExamples(filePath);

    // Extract test coverage information
    const testCoverage = await this.testCoverageAnalyzer.generateSummary(filePath);

    // Check if page already exists
    const existingPage = await this.wikiManager.getPage(pagePath);

    if (existingPage) {
      // Update existing documentation
      const updatedContent = await this.documentationWriterAgent.writeDocumentation(
        conceptName,
        analysis,
        existingPage.content,
        { filePath, codeExamples, testCoverage }
      );

      await this.wikiManager.updatePage(
        pagePath,
        updatedContent,
        {
          title: conceptName,
          category: conceptCategory,
          sourceFile: filePath
        }
      );

      // Update global metadata
      await this.wikiManager.updatePageGlobalMetadata(pagePath, {
        title: conceptName,
        category: conceptCategory,
        sourceFile: filePath,
        incomingLinks: [], // Will be populated in future enhancement
        outgoingLinks: []  // Will be populated in future enhancement
      });

      summary.pagesUpdated++;
    } else {
      // Create new documentation
      const newContent = await this.documentationWriterAgent.writeDocumentation(
        conceptName,
        analysis,
        '', // No existing content
        { filePath, codeExamples, testCoverage }
      );

      await this.wikiManager.createPage(
        pagePath,
        newContent,
        {
          title: conceptName,
          category: conceptCategory,
          sourceFile: filePath,
          related: []
        }
      );

      // Add to global metadata
      await this.wikiManager.updatePageGlobalMetadata(pagePath, {
        title: conceptName,
        created: new Date().toISOString().split('T')[0],
        category: conceptCategory,
        sourceFile: filePath,
        incomingLinks: [],
        outgoingLinks: []
      });

      summary.pagesCreated++;
    }
  }

  /**
   * Process a meta-document (Idea.md, Specification.md, etc.)
   * @param {string} sourceFilePath - Path to meta document
   * @param {string} category - Wiki category (meta/history)
   * @param {string} documentType - Document type (philosophy/specification)
   * @param {string} title - Page title
   * @returns {Promise<Object>} Result object with success status
   */
  async processMetaDocument(sourceFilePath, category, documentType, title) {
    try {
      console.log(`📄 Processing meta-document: ${sourceFilePath}`);

      // Get existing pages for cross-referencing
      const existingPages = await this.wikiManager.getAllPages();

      // Ingest the document - returns markdown content directly
      const markdownContent = await this.metaDocumentIngestionAgent.ingestDocument(
        sourceFilePath,
        category,
        documentType,
        existingPages
      );

      // Determine target path: meta/philosophy.md, meta/specification.md, etc.
      const pagePath = `${category}/${documentType}.md`;

      // Check if page exists
      const existingPage = await this.wikiManager.getRawPage(pagePath);

      let pagesCreated = 0;
      let pagesUpdated = 0;

      if (existingPage) {
        // Update existing page
        await this.wikiManager.updatePage(pagePath, markdownContent, {
          title: title,
          category: category,
          sourceFile: sourceFilePath,
          updated: new Date().toISOString().split('T')[0]
        });
        pagesUpdated++;
      } else {
        // Create new page
        await this.wikiManager.createPage(pagePath, markdownContent, {
          title: title,
          category: category,
          sourceFile: sourceFilePath,
          created: new Date().toISOString().split('T')[0]
        });
        pagesCreated++;
      }

      console.log(`✓ Meta-document processed: ${pagePath}`);

      return { success: true, pagesCreated, pagesUpdated };

    } catch (error) {
      console.error(`Error processing meta-document ${sourceFilePath}:`, error.message);
      // Don't throw - return failure status
      return { success: false, error: error.message };
    }
  }

  /**
   * Extract code examples from test files for a given source file
   * @param {string} filePath - Path to the source file
   * @returns {string} Code examples from tests, or empty string
   */
  async extractCodeExamples(filePath) {
    if (!filePath || filePath === 'Not specified') {
      return '';
    }

    const fs = require('fs').promises;
    const path = require('path');

    try {
      // Convert source file path to potential test file paths
      // e.g., lib/processor.js -> tests/unit/processor.test.js
      const fileName = path.basename(filePath, path.extname(filePath));
      const testPatterns = [
        `tests/unit/${fileName}.test.js`,
        `tests/unit/**/${fileName}.test.js`,
        `tests/${fileName}.test.js`,
        `test/${fileName}.test.js`,
        `__tests__/${fileName}.test.js`
      ];

      // Try to find and read the test file
      for (const pattern of testPatterns) {
        try {
          const testPath = path.join(process.cwd(), pattern.replace('**/', ''));
          const testContent = await fs.readFile(testPath, 'utf-8');

          // Extract first few test cases (up to 500 characters)
          const exampleMatch = testContent.match(/describe\([^{]+\{[\s\S]{0,500}/);
          if (exampleMatch) {
            return `\`\`\`javascript\n${exampleMatch[0]}\n// ... (additional tests omitted)\n\`\`\``;
          }

          // Fallback: just show first 300 characters of test file
          return `\`\`\`javascript\n${testContent.substring(0, 300)}\n// ... (rest omitted)\n\`\`\``;
        } catch (err) {
          // Test file not found, try next pattern
          continue;
        }
      }

      return ''; // No test file found
    } catch (error) {
      console.warn(`Could not extract code examples for ${filePath}:`, error.message);
      return '';
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
   * Detect if a file is a meta-document that should be ingested into the wiki
   * @param {string} filePath - Path to check
   * @returns {Object|null} - { category, documentType, title } or null if not a meta document
   */
  isMetaDocument(filePath) {
    const metaFiles = {
      'Idea.md': { category: 'meta', documentType: 'philosophy', title: 'Philosophy' },
      'Specification.md': { category: 'meta', documentType: 'specification', title: 'Specification' },
      'ImplementationGuide.md': { category: 'meta', documentType: 'implementation-guide', title: 'Implementation Guide' },
      'README.md': { category: 'meta', documentType: 'overview', title: 'Overview' }
    };

    const basename = filePath.split('/').pop();
    return metaFiles[basename] || null;
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
      metaDocumentsProcessed: 0,
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
      stats.metaDocumentsProcessed += (commitSummary.metaDocumentsProcessed || 0);
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

      // Regenerate wiki state (frequency-based)
      // Different agents run at different frequencies to optimize performance
      const isLastCommit = (i === allCommits.length - 1);
      let regenerated = false;

      if (config.shouldRunAgent('architectureOverview', i, allCommits.length)) {
        console.log(`\n🔄 Generating architecture overview (commit ${i + 1}/${allCommits.length})...`);
        await this.generateArchitectureOverview(repoInfo);
        regenerated = true;
      }

      if (config.shouldRunAgent('guideGeneration', i, allCommits.length)) {
        console.log(`\n📚 Generating guides (commit ${i + 1}/${allCommits.length})...`);
        await this.generateWikiGuides(repoInfo);
        regenerated = true;
      }

      if (config.shouldRunAgent('wikiIndex', i, allCommits.length)) {
        console.log(`\n📑 Generating wiki index (commit ${i + 1}/${allCommits.length})...`);
        await this.generateWikiIndex(repoInfo);
        regenerated = true;
      }

      if (config.shouldRunAgent('crossLinking', i, allCommits.length)) {
        console.log(`\n🔗 Adding cross-page links (commit ${i + 1}/${allCommits.length})...`);
        await this.addCrossLinksToAllPages();
        regenerated = true;
      }

      if (regenerated) {
        console.log(`✓ Wiki state updated\n`);
      } else if (!isLastCommit) {
        console.log(`⏭️  Skipping wiki regeneration (next at commits: arch=${this._nextRunCommit('architectureOverview', i, allCommits.length)}, guides=${this._nextRunCommit('guideGeneration', i, allCommits.length)}, index=${this._nextRunCommit('wikiIndex', i, allCommits.length)})\n`);
      }
    }

    // Mark as stopped if we processed all commits
    if (!stats.stopped && state.currentCommit >= allCommits.length) {
      state.status = 'stopped';
      await this.stateManager.saveState(state);
    }

    // Note: Wiki generation (index, guides, architecture) now happens after EACH commit
    // No longer needed here at the end - each commit produces a complete wiki state

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

        // Ensure guides directory exists
        const guideDir = path.dirname(fullPath);
        await fs.mkdir(guideDir, { recursive: true });

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

  /**
   * Add cross-page links to all existing pages
   * Run after all pages are generated to inject hyperlinks
   */
  async addCrossLinksToAllPages() {
    try {
      console.log('Adding cross-page links to all wiki pages...');

      const allPagesMetadata = await this.wikiManager.getAllPages();
      const LinkDiscoveryAgent = require('./agents/link-discovery-agent');
      const linkDiscovery = new LinkDiscoveryAgent();

      // Load full page data for all pages (needed for title and content)
      // Use getRawPage to get markdown content, not HTML
      const allPages = [];
      for (const pageMetadata of allPagesMetadata) {
        const fullPage = await this.wikiManager.getRawPage(pageMetadata.path);
        if (fullPage) {
          allPages.push(fullPage);
        }
      }

      let linksAdded = 0;

      for (const page of allPages) {
        const content = page.content;
        const pagePath = page.path;

        if (!content) {
          continue; // Skip pages without content
        }

        // Find related pages BEFORE adding links (needs original content to detect bold mentions)
        const related = linkDiscovery.findRelatedPages(
          content,
          pagePath,
          allPages
        );

        // Add inline links
        const linkedContent = this.documentationWriterAgent.addCrossLinks(
          content,
          pagePath,
          allPages
        );

        // Only update if changes were made
        if (linkedContent !== content || related.length > 0) {
          // Update frontmatter with related pages
          const updatedMetadata = {
            ...page.metadata,
            related: related.length > 0 ? related : page.metadata.related || []
          };

          // Write updated page
          await this.wikiManager.updatePage(pagePath, linkedContent, updatedMetadata);
          linksAdded++;
        }
      }

      console.log(`Cross-links added to ${linksAdded} pages`);

    } catch (error) {
      console.warn('Warning: Failed to add cross-page links:', error.message);
    }
  }

  /**
   * Calculate the next commit number when an agent will run
   * @param {string} agentName - Name of the agent
   * @param {number} currentIndex - Current commit index (0-based)
   * @param {number} totalCommits - Total number of commits
   * @returns {number} Next commit number (1-based), or totalCommits if last
   * @private
   */
  _nextRunCommit(agentName, currentIndex, totalCommits) {
    const frequency = config.agentFrequencies[agentName] || 1;
    const currentCommitNumber = currentIndex + 1;

    // Calculate next multiple of frequency
    const nextMultiple = Math.ceil(currentCommitNumber / frequency) * frequency;

    // If next multiple is beyond total, return total (last commit)
    return Math.min(nextMultiple, totalCommits);
  }
}

module.exports = Processor;
