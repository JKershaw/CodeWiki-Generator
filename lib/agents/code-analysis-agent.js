const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * CodeAnalysisAgent analyzes code changes using Claude
 */
class CodeAnalysisAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();

    // Configuration from spec
    this.maxTokens = 2000;
    this.maxDiffLines = 2000; // Truncate large diffs
  }

  /**
   * Analyze a code change
   * @param {string} filePath - Path to the changed file
   * @param {string} fileDiff - The diff content
   * @param {string} commitMessage - Commit message
   * @param {Array<string>} relatedPages - Related wiki pages (max 3)
   * @returns {Object} Analysis with concepts, codeElements, relationships
   */
  async analyzeCode(filePath, fileDiff, commitMessage, relatedPages = []) {
    // Truncate large diffs
    const truncatedDiff = this._truncateDiff(fileDiff);

    // Format related pages
    const formattedPages = relatedPages.length > 0
      ? relatedPages.join('\n\n')
      : 'None';

    // Render prompt template
    const prompt = this.promptManager.render('code-analysis', {
      filePath,
      commitMessage,
      diff: truncatedDiff,
      relatedPages: formattedPages
    });

    // Call Claude
    const response = await this.claudeClient.sendMessageJSON(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Validate and return response
    return this._validateResponse(response);
  }

  /**
   * Determine if a file is significant enough to analyze
   * @param {string} filePath - Path to the file
   * @returns {boolean} True if file should be analyzed
   */
  isSignificantFile(filePath) {
    const fileName = filePath.toLowerCase();

    // Skip configuration files
    const configFiles = [
      'package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
      'tsconfig.json', 'jsconfig.json',
      '.eslintrc', '.prettierrc', '.editorconfig',
      'webpack.config', 'vite.config', 'rollup.config',
      '.gitignore', '.npmignore', '.dockerignore'
    ];

    for (const configFile of configFiles) {
      if (fileName.includes(configFile.toLowerCase())) {
        return false;
      }
    }

    // Skip test files
    if (fileName.includes('.test.') ||
        fileName.includes('.spec.') ||
        fileName.includes('__tests__') ||
        fileName.includes('__mocks__')) {
      return false;
    }

    // Skip documentation
    if (fileName.endsWith('.md') || fileName.endsWith('.txt')) {
      return false;
    }

    // Skip build artifacts
    if (fileName.includes('dist/') ||
        fileName.includes('build/') ||
        fileName.includes('coverage/') ||
        fileName.includes('node_modules/')) {
      return false;
    }

    // Accept source code files
    const sourceExtensions = [
      '.js', '.jsx', '.ts', '.tsx',
      '.py', '.rb', '.java', '.go',
      '.rs', '.c', '.cpp', '.h',
      '.php', '.swift', '.kt'
    ];

    for (const ext of sourceExtensions) {
      if (fileName.endsWith(ext)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Truncate diff if too large
   * @private
   */
  _truncateDiff(diff) {
    const lines = diff.split('\n');

    if (lines.length <= this.maxDiffLines) {
      return diff;
    }

    // Keep first half and last quarter
    const keepStart = Math.floor(this.maxDiffLines * 0.6);
    const keepEnd = Math.floor(this.maxDiffLines * 0.3);

    const truncated = [
      ...lines.slice(0, keepStart),
      '',
      `... [${lines.length - keepStart - keepEnd} lines truncated] ...`,
      '',
      ...lines.slice(-keepEnd)
    ];

    return truncated.join('\n');
  }

  /**
   * Validate response structure
   * @private
   */
  _validateResponse(response) {
    // Extract file path from response
    const filePath = response.filePath || 'Not specified';

    // Normalize concepts to new format (backward compatible)
    let concepts = response.concepts || [];
    if (concepts.length > 0 && typeof concepts[0] === 'string') {
      // Old format: array of strings - convert to objects
      concepts = concepts.map(name => ({
        name,
        category: 'component', // Default to component for backward compatibility
        abstraction: 'low',
        reason: 'Auto-converted from legacy format',
        sourceFile: filePath
      }));
    }

    // Ensure all concept objects have required fields including sourceFile
    concepts = concepts.map(concept => ({
      name: concept.name || concept,
      category: concept.category || 'component',
      abstraction: concept.abstraction || 'low',
      reason: concept.reason || '',
      sourceFile: concept.sourceFile || filePath
    }));

    return {
      filePath,
      concepts,
      codeElements: response.codeElements || [],
      relationships: response.relationships || [],
      suggestedGuides: response.suggestedGuides || []
    };
  }
}

module.exports = CodeAnalysisAgent;
