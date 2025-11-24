const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * TechDebtAnalysisAgent identifies technical debt in code changes
 * Detects code smells, complexity issues, TODOs, and refactoring opportunities
 */
class TechDebtAnalysisAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();

    // Configuration
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 2000;
    this.minSeverity = 'low'; // Minimum severity to report: low, medium, high
  }

  /**
   * Analyze code change for technical debt
   * @param {string} filePath - Path to the changed file
   * @param {string} fileDiff - The diff content
   * @param {Object} codeAnalysis - Code analysis result from CodeAnalysisAgent
   * @returns {Object} Analysis with debt items, trends, and recommendations
   */
  async analyze(filePath, fileDiff, codeAnalysis) {
    // Skip analysis for non-significant files
    if (!this._isSignificantForDebtAnalysis(filePath)) {
      return {
        filePath,
        items: [],
        summary: {
          totalItems: 0,
          highPriority: 0,
          mediumPriority: 0,
          lowPriority: 0
        }
      };
    }

    // Truncate large diffs
    const truncatedDiff = this._truncateDiff(fileDiff);

    // Format code elements from analysis
    const codeElementsText = this._formatCodeElements(codeAnalysis);

    // Render prompt template
    const prompt = this.promptManager.render('tech-debt-analysis', {
      filePath,
      diff: truncatedDiff,
      codeElements: codeElementsText
    });

    // Call Claude
    const response = await this.claudeClient.sendMessageJSON(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Validate and return response
    return this._validateResponse(response, filePath);
  }

  /**
   * Determine if file should be analyzed for tech debt
   * @private
   */
  _isSignificantForDebtAnalysis(filePath) {
    const fileName = filePath.toLowerCase();

    // Skip test files - they have different quality standards
    if (fileName.includes('.test.') ||
        fileName.includes('.spec.') ||
        fileName.includes('__tests__') ||
        fileName.includes('__mocks__')) {
      return false;
    }

    // Skip config and documentation
    if (fileName.endsWith('.md') ||
        fileName.endsWith('.json') ||
        fileName.endsWith('.txt') ||
        fileName.endsWith('.yml') ||
        fileName.endsWith('.yaml')) {
      return false;
    }

    // Skip build artifacts
    if (fileName.includes('dist/') ||
        fileName.includes('build/') ||
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

    return sourceExtensions.some(ext => fileName.endsWith(ext));
  }

  /**
   * Truncate diff if too large
   * @private
   */
  _truncateDiff(diff) {
    const maxLines = 1000;
    const lines = diff.split('\n');

    if (lines.length <= maxLines) {
      return diff;
    }

    const keepStart = Math.floor(maxLines * 0.7);
    const keepEnd = Math.floor(maxLines * 0.3);

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
   * Format code elements from analysis for prompt
   * @private
   */
  _formatCodeElements(codeAnalysis) {
    if (!codeAnalysis || !codeAnalysis.codeElements || codeAnalysis.codeElements.length === 0) {
      return 'No code elements identified';
    }

    return codeAnalysis.codeElements
      .map(el => `- ${el.name} (${el.type}): ${el.purpose}`)
      .join('\n');
  }

  /**
   * Validate response structure
   * @private
   */
  _validateResponse(response, filePath) {
    // Ensure items array exists
    let items = Array.isArray(response.items) ? response.items : [];

    // Validate each item
    items = items.map(item => ({
      type: item.type || 'code-smell',
      severity: this._normalizeSeverity(item.severity),
      title: item.title || 'Untitled Issue',
      description: item.description || '',
      location: item.location || filePath,
      recommendation: item.recommendation || '',
      impact: item.impact || 'Unknown impact'
    }));

    // Filter by minimum severity
    items = items.filter(item => this._meetsMinimumSeverity(item.severity));

    // Calculate summary
    const summary = {
      totalItems: items.length,
      highPriority: items.filter(i => i.severity === 'high').length,
      mediumPriority: items.filter(i => i.severity === 'medium').length,
      lowPriority: items.filter(i => i.severity === 'low').length
    };

    return {
      filePath,
      items,
      summary,
      trend: response.trend || 'neutral', // improving, neutral, worsening
      recommendations: Array.isArray(response.recommendations) ? response.recommendations : []
    };
  }

  /**
   * Normalize severity to standard levels
   * @private
   */
  _normalizeSeverity(severity) {
    const normalized = (severity || 'low').toLowerCase();
    if (['high', 'medium', 'low'].includes(normalized)) {
      return normalized;
    }
    // Map non-standard values
    if (['critical', 'severe'].includes(normalized)) return 'high';
    if (['minor', 'trivial'].includes(normalized)) return 'low';
    return 'medium'; // Default
  }

  /**
   * Check if severity meets minimum threshold
   * @private
   */
  _meetsMinimumSeverity(severity) {
    const levels = { low: 1, medium: 2, high: 3 };
    const itemLevel = levels[severity] || 1;
    const minLevel = levels[this.minSeverity] || 1;
    return itemLevel >= minLevel;
  }
}

module.exports = TechDebtAnalysisAgent;
