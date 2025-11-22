const WikiManager = require('./wiki-manager');
const StateManager = require('./state-manager');
const CodeAnalysisAgent = require('./agents/code-analysis-agent');
const DocumentationWriterAgent = require('./agents/documentation-writer-agent');

/**
 * Processor handles the main processing logic for analyzing commits
 * and generating/updating documentation
 */
class Processor {
  constructor(wikiPath = './dev-wiki') {
    this.wikiManager = new WikiManager(wikiPath);
    this.stateManager = new StateManager();
    this.codeAnalysisAgent = new CodeAnalysisAgent();
    this.documentationWriterAgent = new DocumentationWriterAgent();
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
   * @param {string} conceptName - Name of the concept
   * @param {Object} analysis - Code analysis result
   * @param {Object} summary - Processing summary to update
   */
  async processConceptDocumentation(conceptName, analysis, summary) {
    const pagePath = this.determinePagePath(conceptName);

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
        conceptName,
        updatedContent
      );

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
        conceptName,
        newContent,
        {
          category: 'components',
          related: []
        }
      );

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
   * Converts concept name to kebab-case and places in components/
   * @param {string} conceptName - Name of the concept
   * @returns {string} Page path (without .md extension)
   */
  determinePagePath(conceptName) {
    // Convert to kebab-case
    // 'AuthService' -> 'auth-service'
    // 'UserAuthenticationManager' -> 'user-authentication-manager'
    // 'Session Manager' -> 'session-manager'
    const kebab = conceptName
      .replace(/([a-z])([A-Z])/g, '$1-$2') // CamelCase to kebab
      .replace(/\s+/g, '-') // Spaces to dashes
      .toLowerCase();

    return `components/${kebab}`;
  }
}

module.exports = Processor;
